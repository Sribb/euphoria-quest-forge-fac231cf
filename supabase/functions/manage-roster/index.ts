import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify the calling user
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, email, classId, studentId, targetClassId, memberId } = await req.json();
    const adminClient = createClient(supabaseUrl, serviceKey);

    // Verify educator owns the class
    const { data: cls, error: clsError } = await adminClient
      .from("classes")
      .select("id, educator_id, class_code")
      .eq("id", classId)
      .single();

    if (clsError || !cls || cls.educator_id !== user.id) {
      return new Response(JSON.stringify({ error: "Class not found or unauthorized" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "add_by_email") {
      // Find user by email
      const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers();
      if (listError) throw listError;

      const student = users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());
      if (!student) {
        return new Response(JSON.stringify({ error: "No account found with that email" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if already a member
      const { data: existing } = await adminClient
        .from("class_members")
        .select("id")
        .eq("class_id", classId)
        .eq("student_id", student.id)
        .maybeSingle();

      if (existing) {
        return new Response(JSON.stringify({ error: "Student is already in this class" }), {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get student display name
      const { data: profile } = await adminClient
        .from("profiles")
        .select("display_name")
        .eq("id", student.id)
        .single();

      // Add to class
      const { error: insertError } = await adminClient
        .from("class_members")
        .insert({ class_id: classId, student_id: student.id });

      if (insertError) throw insertError;

      return new Response(JSON.stringify({
        success: true,
        studentName: profile?.display_name || student.email,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "transfer") {
      if (!studentId || !targetClassId || !memberId) {
        return new Response(JSON.stringify({ error: "Missing studentId, targetClassId, or memberId" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify educator owns target class
      const { data: targetCls } = await adminClient
        .from("classes")
        .select("id, educator_id")
        .eq("id", targetClassId)
        .single();

      if (!targetCls || targetCls.educator_id !== user.id) {
        return new Response(JSON.stringify({ error: "Target class not found or unauthorized" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check not already in target
      const { data: existingTarget } = await adminClient
        .from("class_members")
        .select("id")
        .eq("class_id", targetClassId)
        .eq("student_id", studentId)
        .maybeSingle();

      if (existingTarget) {
        return new Response(JSON.stringify({ error: "Student is already in the target class" }), {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Remove from source class
      const { error: delError } = await adminClient
        .from("class_members")
        .delete()
        .eq("id", memberId);
      if (delError) throw delError;

      // Add to target class
      const { error: addError } = await adminClient
        .from("class_members")
        .insert({ class_id: targetClassId, student_id: studentId });
      if (addError) throw addError;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
