import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface StudentInput {
  firstName: string;
  lastName: string;
  email: string | null;
  studentId: string | null;
}

interface ResultEntry {
  email: string;
  username: string;
  password: string;
  displayName: string;
  joinCode: string;
  joinLink: string;
  success: boolean;
  error?: string;
}

function generatePassword(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz";
  const nums = "23456789";
  let pwd = "";
  for (let i = 0; i < 4; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
  for (let i = 0; i < 3; i++) pwd += nums[Math.floor(Math.random() * nums.length)];
  pwd += "!";
  // Capitalize first letter
  return pwd.charAt(0).toUpperCase() + pwd.slice(1);
}

function generateUsername(firstName: string, lastName: string, studentId: string | null, existingUsernames: Set<string>): string {
  // Try student ID first
  if (studentId) {
    const idBased = studentId.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (idBased && !existingUsernames.has(idBased)) {
      existingUsernames.add(idBased);
      return idBased;
    }
  }

  // Try firstname.lastname
  const base = `${firstName.toLowerCase().replace(/[^a-z]/g, "")}.${lastName.toLowerCase().replace(/[^a-z]/g, "")}`;
  if (!existingUsernames.has(base)) {
    existingUsernames.add(base);
    return base;
  }

  // Append numbers
  for (let i = 2; i < 1000; i++) {
    const candidate = `${base}${i}`;
    if (!existingUsernames.has(candidate)) {
      existingUsernames.add(candidate);
      return candidate;
    }
  }
  const random = base + Math.floor(Math.random() * 9999);
  existingUsernames.add(random);
  return random;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify caller is authenticated
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify the caller using their JWT
    const callerClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check caller has educator role
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .in("role", ["educator", "admin"]);

    if (!roleData || roleData.length === 0) {
      return new Response(JSON.stringify({ error: "Only educators can import rosters" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { students, classId, classCode, educatorId } = await req.json() as {
      students: StudentInput[];
      classId: string;
      classCode: string;
      educatorId: string;
    };

    if (!students || students.length === 0) {
      return new Response(JSON.stringify({ error: "No students provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (students.length > 200) {
      return new Response(JSON.stringify({ error: "Maximum 200 students per import" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the app URL for join links
    const appUrl = req.headers.get("origin") || "https://euphoria-quest-forge.lovable.app";

    const existingUsernames = new Set<string>();
    const results: ResultEntry[] = [];

    for (const student of students) {
      const displayName = `${student.firstName} ${student.lastName}`;
      const username = generateUsername(student.firstName, student.lastName, student.studentId, existingUsernames);
      const password = generatePassword();
      // Use email if provided, otherwise generate a placeholder
      const email = student.email || `${username}@euphoria.local`;

      try {
        // Create user via admin API
        const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // Auto-confirm since educator is creating
          user_metadata: {
            display_name: displayName,
            username,
            signup_role: "student",
            imported_by: educatorId,
            student_id: student.studentId,
          },
        });

        if (createError) {
          // If user already exists with this email, just add to class
          if (createError.message?.includes("already been registered") || createError.message?.includes("already exists")) {
            // Try to find existing user and add to class
            const { data: existingUsers } = await adminClient.auth.admin.listUsers();
            const existingUser = existingUsers?.users?.find((u) => u.email === email);
            
            if (existingUser && classId) {
              // Add to class
              await adminClient.from("class_members").upsert(
                { class_id: classId, student_id: existingUser.id },
                { onConflict: "class_id,student_id", ignoreDuplicates: true }
              );
            }

            results.push({
              email,
              username,
              password: "(existing account)",
              displayName,
              joinCode: classCode,
              joinLink: `${appUrl}/auth?join=${classCode}`,
              success: true,
              error: "Account already exists — added to class",
            });
            continue;
          }

          throw createError;
        }

        if (!newUser.user) throw new Error("User creation returned no user");

        // Add to class
        if (classId) {
          await adminClient.from("class_members").insert({
            class_id: classId,
            student_id: newUser.user.id,
          });
        }

        const joinLink = `${appUrl}/auth?join=${classCode}`;

        results.push({
          email,
          username,
          password,
          displayName,
          joinCode: classCode,
          joinLink,
          success: true,
        });
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        results.push({
          email,
          username,
          password: "",
          displayName,
          joinCode: classCode,
          joinLink: "",
          success: false,
          error: errorMessage,
        });
      }
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Bulk create error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
