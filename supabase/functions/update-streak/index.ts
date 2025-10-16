import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Get current streak data
    const { data: streakData, error: streakError } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (streakError) {
      console.error('Error fetching streak:', streakError);
      throw streakError;
    }

    const today = new Date().toISOString().split('T')[0];
    const lastLogin = streakData.last_login_date;

    // If already logged in today, no update needed
    if (lastLogin === today) {
      return new Response(
        JSON.stringify({ 
          message: 'Streak already updated today',
          streak: streakData.current_streak 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate new streak
    let newStreak = streakData.current_streak;
    const lastLoginDate = lastLogin ? new Date(lastLogin) : null;
    const todayDate = new Date(today);

    if (lastLoginDate) {
      const daysDiff = Math.floor((todayDate.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day - increment streak
        newStreak += 1;
      } else if (daysDiff > 1) {
        // Missed a day - reset streak
        newStreak = 1;
      }
    } else {
      // First login
      newStreak = 1;
    }

    // Update streak
    const { data: updatedStreak, error: updateError } = await supabase
      .from('streaks')
      .update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, streakData.longest_streak || 0),
        last_login_date: today,
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating streak:', updateError);
      throw updateError;
    }

    // Award coins for milestone streaks
    const milestones = [3, 7, 10, 14, 30];
    if (milestones.includes(newStreak)) {
      const coinReward = newStreak * 10; // 10 coins per streak day at milestones
      
      // Update user coins atomically
      const { error: coinsError } = await supabase.rpc('increment_coins', {
        user_id_param: user.id,
        amount: coinReward,
      });

      if (coinsError) {
        console.error('Error awarding coins:', coinsError);
      }

      // Record transaction (service role bypasses RLS)
      const { error: txError } = await supabase.from('transactions').insert({
        user_id: user.id,
        amount: coinReward,
        transaction_type: 'reward',
        description: `${newStreak}-day streak milestone reward`,
      });

      if (txError) {
        console.error('Error recording transaction:', txError);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Streak updated successfully',
        streak: updatedStreak 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error in update-streak function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
