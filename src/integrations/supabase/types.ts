export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          requirement_type: string
          requirement_value: number
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          requirement_type: string
          requirement_value: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          requirement_type?: string
          requirement_value?: number
          title?: string
        }
        Relationships: []
      }
      ai_competitors: {
        Row: {
          capital: number
          created_at: string
          id: string
          last_action_at: string | null
          learning_data: Json
          name: string
          performance_score: number
          personality_traits: Json
          portfolio: Json
          session_id: string
          strategy_type: string
          total_trades: number
          updated_at: string
          win_rate: number
        }
        Insert: {
          capital?: number
          created_at?: string
          id?: string
          last_action_at?: string | null
          learning_data?: Json
          name: string
          performance_score?: number
          personality_traits?: Json
          portfolio?: Json
          session_id: string
          strategy_type: string
          total_trades?: number
          updated_at?: string
          win_rate?: number
        }
        Update: {
          capital?: number
          created_at?: string
          id?: string
          last_action_at?: string | null
          learning_data?: Json
          name?: string
          performance_score?: number
          personality_traits?: Json
          portfolio?: Json
          session_id?: string
          strategy_type?: string
          total_trades?: number
          updated_at?: string
          win_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_competitors_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_market_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_lesson_interactions: {
        Row: {
          ai_response: string
          created_at: string
          id: string
          interaction_type: string
          lesson_id: string
          user_id: string
          user_input: string | null
        }
        Insert: {
          ai_response: string
          created_at?: string
          id?: string
          interaction_type: string
          lesson_id: string
          user_id: string
          user_input?: string | null
        }
        Update: {
          ai_response?: string
          created_at?: string
          id?: string
          interaction_type?: string
          lesson_id?: string
          user_id?: string
          user_input?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_lesson_interactions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_market_events: {
        Row: {
          affected_sectors: string[]
          affected_symbols: string[]
          cause_chain: Json
          created_at: string
          description: string
          duration_minutes: number
          event_type: string
          expires_at: string
          id: string
          impact_multiplier: number
          is_active: boolean
          session_id: string
          severity: string
          title: string
          triggered_at: string
        }
        Insert: {
          affected_sectors?: string[]
          affected_symbols?: string[]
          cause_chain?: Json
          created_at?: string
          description: string
          duration_minutes?: number
          event_type: string
          expires_at: string
          id?: string
          impact_multiplier?: number
          is_active?: boolean
          session_id: string
          severity: string
          title: string
          triggered_at?: string
        }
        Update: {
          affected_sectors?: string[]
          affected_symbols?: string[]
          cause_chain?: Json
          created_at?: string
          description?: string
          duration_minutes?: number
          event_type?: string
          expires_at?: string
          id?: string
          impact_multiplier?: number
          is_active?: boolean
          session_id?: string
          severity?: string
          title?: string
          triggered_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_market_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_market_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_market_sessions: {
        Row: {
          created_at: string
          id: string
          last_active_at: string
          market_trend: string
          market_volatility: number
          session_name: string
          session_seed: string
          session_status: string
          started_at: string
          total_trades: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_active_at?: string
          market_trend?: string
          market_volatility?: number
          session_name?: string
          session_seed: string
          session_status?: string
          started_at?: string
          total_trades?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_active_at?: string
          market_trend?: string
          market_volatility?: number
          session_name?: string
          session_seed?: string
          session_status?: string
          started_at?: string
          total_trades?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_scenario_predictions: {
        Row: {
          confidence_score: number
          created_at: string
          description: string
          id: string
          predicted_outcomes: Json
          probability_distribution: Json
          proposed_action: Json
          scenario_type: string
          session_id: string
          time_horizon_minutes: number
          title: string
          user_id: string
        }
        Insert: {
          confidence_score?: number
          created_at?: string
          description: string
          id?: string
          predicted_outcomes?: Json
          probability_distribution?: Json
          proposed_action: Json
          scenario_type: string
          session_id: string
          time_horizon_minutes?: number
          title: string
          user_id: string
        }
        Update: {
          confidence_score?: number
          created_at?: string
          description?: string
          id?: string
          predicted_outcomes?: Json
          probability_distribution?: Json
          proposed_action?: Json
          scenario_type?: string
          session_id?: string
          time_horizon_minutes?: number
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_scenario_predictions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_market_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_stock_prices: {
        Row: {
          ai_sentiment: number
          current_price: number
          day_high: number
          day_low: number
          day_open: number
          id: string
          previous_price: number
          price_momentum: number
          session_id: string
          symbol: string
          updated_at: string
          volatility_index: number
          volume: number
        }
        Insert: {
          ai_sentiment?: number
          current_price: number
          day_high: number
          day_low: number
          day_open: number
          id?: string
          previous_price: number
          price_momentum?: number
          session_id: string
          symbol: string
          updated_at?: string
          volatility_index?: number
          volume?: number
        }
        Update: {
          ai_sentiment?: number
          current_price?: number
          day_high?: number
          day_low?: number
          day_open?: number
          id?: string
          previous_price?: number
          price_momentum?: number
          session_id?: string
          symbol?: string
          updated_at?: string
          volatility_index?: number
          volume?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_stock_prices_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_market_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_tips: {
        Row: {
          category: string
          created_at: string
          id: string
          tip_text: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          tip_text: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          tip_text?: string
        }
        Relationships: []
      }
      ai_trade_analysis: {
        Row: {
          ai_recommendation: string
          alternative_strategies: Json
          analysis_type: string
          created_at: string
          id: string
          impact_prediction: Json
          opportunity_score: number
          order_id: string | null
          proposed_price: number
          quantity: number
          reasoning: string
          risk_assessment: Json
          session_id: string
          symbol: string
          trade_type: string
          user_id: string
        }
        Insert: {
          ai_recommendation: string
          alternative_strategies?: Json
          analysis_type: string
          created_at?: string
          id?: string
          impact_prediction: Json
          opportunity_score?: number
          order_id?: string | null
          proposed_price: number
          quantity: number
          reasoning: string
          risk_assessment: Json
          session_id: string
          symbol: string
          trade_type: string
          user_id: string
        }
        Update: {
          ai_recommendation?: string
          alternative_strategies?: Json
          analysis_type?: string
          created_at?: string
          id?: string
          impact_prediction?: Json
          opportunity_score?: number
          order_id?: string | null
          proposed_price?: number
          quantity?: number
          reasoning?: string
          risk_assessment?: Json
          session_id?: string
          symbol?: string
          trade_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_trade_analysis_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_trade_analysis_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_market_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          author_id: string
          content: string
          created_at: string
          expires_at: string | null
          id: string
          is_published: boolean
          priority: string
          published_at: string | null
          target_role: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_published?: boolean
          priority?: string
          published_at?: string | null
          target_role?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_published?: boolean
          priority?: string
          published_at?: string | null
          target_role?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      assignment_submissions: {
        Row: {
          assignment_id: string
          completed_at: string | null
          created_at: string
          id: string
          score: number | null
          started_at: string | null
          status: string
          student_id: string
        }
        Insert: {
          assignment_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          score?: number | null
          started_at?: string | null
          status?: string
          student_id: string
        }
        Update: {
          assignment_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          score?: number | null
          started_at?: string | null
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_templates: {
        Row: {
          created_at: string
          description: string | null
          educator_id: string
          id: string
          is_public: boolean
          items: Json
          meeting_days: string[]
          name: string
          template_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          educator_id: string
          id?: string
          is_public?: boolean
          items?: Json
          meeting_days?: string[]
          name: string
          template_type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          educator_id?: string
          id?: string
          is_public?: boolean
          items?: Json
          meeting_days?: string[]
          name?: string
          template_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      assignments: {
        Row: {
          class_ids: string[]
          created_at: string
          due_date: string | null
          educator_id: string
          id: string
          instructions: string | null
          is_published: boolean
          lesson_id: string
          scheduled_at: string | null
          student_ids: string[]
          target_type: string
          title: string
          updated_at: string
        }
        Insert: {
          class_ids?: string[]
          created_at?: string
          due_date?: string | null
          educator_id: string
          id?: string
          instructions?: string | null
          is_published?: boolean
          lesson_id: string
          scheduled_at?: string | null
          student_ids?: string[]
          target_type?: string
          title: string
          updated_at?: string
        }
        Update: {
          class_ids?: string[]
          created_at?: string
          due_date?: string | null
          educator_id?: string
          id?: string
          instructions?: string | null
          is_published?: boolean
          lesson_id?: string
          scheduled_at?: string | null
          student_ids?: string[]
          target_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      automated_reminders: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_active: boolean
          last_triggered_at: string | null
          message: string
          target_users: string
          title: string
          trigger_config: Json
          trigger_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean
          last_triggered_at?: string | null
          message: string
          target_users?: string
          title: string
          trigger_config?: Json
          trigger_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean
          last_triggered_at?: string | null
          message?: string
          target_users?: string
          title?: string
          trigger_config?: Json
          trigger_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      class_members: {
        Row: {
          class_id: string
          id: string
          joined_at: string
          student_id: string
        }
        Insert: {
          class_id: string
          id?: string
          joined_at?: string
          student_id: string
        }
        Update: {
          class_id?: string
          id?: string
          joined_at?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_members_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          archived_at: string | null
          class_code: string
          class_name: string
          created_at: string
          description: string | null
          display_color: string | null
          educator_id: string
          grade_level: string | null
          id: string
          is_active: boolean | null
          max_students: number | null
          period_block: string | null
          requires_coppa_consent: boolean
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          class_code: string
          class_name: string
          created_at?: string
          description?: string | null
          display_color?: string | null
          educator_id: string
          grade_level?: string | null
          id?: string
          is_active?: boolean | null
          max_students?: number | null
          period_block?: string | null
          requires_coppa_consent?: boolean
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          class_code?: string
          class_name?: string
          created_at?: string
          description?: string | null
          display_color?: string | null
          educator_id?: string
          grade_level?: string | null
          id?: string
          is_active?: boolean | null
          max_students?: number | null
          period_block?: string | null
          requires_coppa_consent?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      data_deletion_requests: {
        Row: {
          cancelled_at: string | null
          certificate_url: string | null
          class_id: string | null
          class_name: string | null
          created_at: string
          data_categories: Json
          deletion_type: string
          educator_id: string
          id: string
          purged_at: string | null
          reason: string | null
          requested_at: string
          scheduled_purge_at: string
          status: string
          student_id: string
          student_name: string
          updated_at: string
        }
        Insert: {
          cancelled_at?: string | null
          certificate_url?: string | null
          class_id?: string | null
          class_name?: string | null
          created_at?: string
          data_categories?: Json
          deletion_type?: string
          educator_id: string
          id?: string
          purged_at?: string | null
          reason?: string | null
          requested_at?: string
          scheduled_purge_at?: string
          status?: string
          student_id: string
          student_name?: string
          updated_at?: string
        }
        Update: {
          cancelled_at?: string | null
          certificate_url?: string | null
          class_id?: string | null
          class_name?: string | null
          created_at?: string
          data_categories?: Json
          deletion_type?: string
          educator_id?: string
          id?: string
          purged_at?: string | null
          reason?: string | null
          requested_at?: string
          scheduled_purge_at?: string
          status?: string
          student_id?: string
          student_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_deletion_requests_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      direct_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      dpa_records: {
        Row: {
          contract_start_date: string
          created_at: string
          district_address: string
          district_name: string
          generated_at: string
          id: string
          pdf_url: string | null
          signatory_email: string
          signatory_name: string
          signatory_title: string
          state: string
          status: string
          student_count: number
          term_years: number
          updated_at: string
          user_id: string
        }
        Insert: {
          contract_start_date: string
          created_at?: string
          district_address: string
          district_name: string
          generated_at?: string
          id?: string
          pdf_url?: string | null
          signatory_email: string
          signatory_name: string
          signatory_title: string
          state: string
          status?: string
          student_count: number
          term_years?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          contract_start_date?: string
          created_at?: string
          district_address?: string
          district_name?: string
          generated_at?: string
          id?: string
          pdf_url?: string | null
          signatory_email?: string
          signatory_name?: string
          signatory_title?: string
          state?: string
          status?: string
          student_count?: number
          term_years?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      educator_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          read_at: string | null
          recipient_id: string
          sender_id: string
          subject: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          read_at?: string | null
          recipient_id: string
          sender_id: string
          subject?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          subject?: string | null
        }
        Relationships: []
      }
      educator_notes: {
        Row: {
          created_at: string
          educator_id: string
          id: string
          is_private: boolean
          note: string
          note_type: string
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          educator_id: string
          id?: string
          is_private?: boolean
          note: string
          note_type?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          educator_id?: string
          id?: string
          is_private?: boolean
          note?: string
          note_type?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      educator_profiles: {
        Row: {
          created_at: string
          estimated_class_size: number | null
          grade_level: string | null
          id: string
          is_premium: boolean | null
          premium_since: string | null
          school_name: string
          stripe_customer_id: string | null
          subject: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          estimated_class_size?: number | null
          grade_level?: string | null
          id?: string
          is_premium?: boolean | null
          premium_since?: string | null
          school_name: string
          stripe_customer_id?: string | null
          subject?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          estimated_class_size?: number | null
          grade_level?: string | null
          id?: string
          is_premium?: boolean | null
          premium_since?: string | null
          school_name?: string
          stripe_customer_id?: string | null
          subject?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          coins_earned: number
          completed: boolean
          created_at: string
          game_id: string
          id: string
          score: number
          user_id: string
        }
        Insert: {
          coins_earned?: number
          completed?: boolean
          created_at?: string
          game_id: string
          id?: string
          score?: number
          user_id: string
        }
        Update: {
          coins_earned?: number
          completed?: boolean
          created_at?: string
          game_id?: string
          id?: string
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          base_reward: number
          created_at: string
          description: string
          difficulty: string
          id: string
          title: string
        }
        Insert: {
          base_reward: number
          created_at?: string
          description: string
          difficulty: string
          id?: string
          title: string
        }
        Update: {
          base_reward?: number
          created_at?: string
          description?: string
          difficulty?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "message_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_messages: {
        Row: {
          content: string
          created_at: string
          group_id: string
          id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          group_id: string
          id?: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          group_id?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "message_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_question_performance: {
        Row: {
          created_at: string | null
          difficulty_level: string
          id: string
          is_correct: boolean
          lesson_id: string
          question_text: string
          time_taken_seconds: number | null
          topic_category: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          difficulty_level: string
          id?: string
          is_correct: boolean
          lesson_id: string
          question_text: string
          time_taken_seconds?: number | null
          topic_category: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          difficulty_level?: string
          id?: string
          is_correct?: boolean
          lesson_id?: string
          question_text?: string
          time_taken_seconds?: number | null
          topic_category?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_question_performance_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string
          created_at: string
          description: string
          difficulty: string
          duration_minutes: number
          id: string
          is_locked: boolean
          order_index: number
          pathway: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          description: string
          difficulty?: string
          duration_minutes: number
          id?: string
          is_locked?: boolean
          order_index: number
          pathway?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          description?: string
          difficulty?: string
          duration_minutes?: number
          id?: string
          is_locked?: boolean
          order_index?: number
          pathway?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      live_sessions: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number
          host_id: string
          id: string
          max_participants: number | null
          recording_url: string | null
          scheduled_at: string
          session_type: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          host_id: string
          id?: string
          max_participants?: number | null
          recording_url?: string | null
          scheduled_at: string
          session_type?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          host_id?: string
          id?: string
          max_participants?: number | null
          recording_url?: string | null
          scheduled_at?: string
          session_type?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      lti_content_items: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          description: string | null
          educator_id: string
          id: string
          pathway: string | null
          scoring_mode: string
          title: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          description?: string | null
          educator_id: string
          id?: string
          pathway?: string | null
          scoring_mode?: string
          title: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          description?: string | null
          educator_id?: string
          id?: string
          pathway?: string | null
          scoring_mode?: string
          title?: string
        }
        Relationships: []
      }
      lti_keys: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          kid: string
          private_key_pem: string
          public_key_jwk: Json
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          kid: string
          private_key_pem: string
          public_key_jwk: Json
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          kid?: string
          private_key_pem?: string
          public_key_jwk?: Json
        }
        Relationships: []
      }
      lti_launches: {
        Row: {
          ags_endpoint: string | null
          ags_token_url: string | null
          completion_status: string | null
          content_id: string
          content_type: string
          id: string
          last_score_synced_at: string | null
          launched_at: string
          lineitem_url: string | null
          lti_user_id: string | null
          platform_id: string
          score_max: number | null
          score_value: number | null
          scoring_mode: string
          user_id: string
        }
        Insert: {
          ags_endpoint?: string | null
          ags_token_url?: string | null
          completion_status?: string | null
          content_id: string
          content_type: string
          id?: string
          last_score_synced_at?: string | null
          launched_at?: string
          lineitem_url?: string | null
          lti_user_id?: string | null
          platform_id: string
          score_max?: number | null
          score_value?: number | null
          scoring_mode?: string
          user_id: string
        }
        Update: {
          ags_endpoint?: string | null
          ags_token_url?: string | null
          completion_status?: string | null
          content_id?: string
          content_type?: string
          id?: string
          last_score_synced_at?: string | null
          launched_at?: string
          lineitem_url?: string | null
          lti_user_id?: string | null
          platform_id?: string
          score_max?: number | null
          score_value?: number | null
          scoring_mode?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lti_launches_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "lti_platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      lti_nonces: {
        Row: {
          id: string
          nonce: string
          platform_id: string
          used_at: string
        }
        Insert: {
          id?: string
          nonce: string
          platform_id: string
          used_at?: string
        }
        Update: {
          id?: string
          nonce?: string
          platform_id?: string
          used_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lti_nonces_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "lti_platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      lti_platforms: {
        Row: {
          auth_login_url: string
          auth_token_url: string
          client_id: string
          created_at: string
          deployment_id: string
          educator_id: string
          id: string
          issuer: string
          jwks_url: string
          name: string
          updated_at: string
        }
        Insert: {
          auth_login_url: string
          auth_token_url: string
          client_id: string
          created_at?: string
          deployment_id: string
          educator_id: string
          id?: string
          issuer: string
          jwks_url: string
          name: string
          updated_at?: string
        }
        Update: {
          auth_login_url?: string
          auth_token_url?: string
          client_id?: string
          created_at?: string
          deployment_id?: string
          educator_id?: string
          id?: string
          issuer?: string
          jwks_url?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      message_groups: {
        Row: {
          avatar_color: string | null
          created_at: string
          creator_id: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          avatar_color?: string | null
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          avatar_color?: string | null
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      news_cache: {
        Row: {
          id: number
          news_items: Json
          updated_at: string | null
        }
        Insert: {
          id?: number
          news_items: Json
          updated_at?: string | null
        }
        Update: {
          id?: number
          news_items?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      onboarding_ab_analytics: {
        Row: {
          action: string
          created_at: string
          id: string
          response: Json | null
          step_name: string
          step_number: number
          time_spent_ms: number | null
          user_id: string
          variant: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          response?: Json | null
          step_name: string
          step_number: number
          time_spent_ms?: number | null
          user_id: string
          variant: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          response?: Json | null
          step_name?: string
          step_number?: number
          time_spent_ms?: number | null
          user_id?: string
          variant?: string
        }
        Relationships: []
      }
      onboarding_ab_assignments: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          total_time_ms: number | null
          user_id: string
          variant: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          total_time_ms?: number | null
          user_id: string
          variant: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          total_time_ms?: number | null
          user_id?: string
          variant?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          average_fill_price: number | null
          canceled_at: string | null
          commission: number | null
          created_at: string
          filled_at: string | null
          filled_quantity: number | null
          id: string
          order_type: string
          placed_at: string
          portfolio_id: string
          price: number | null
          quantity: number
          rejection_reason: string | null
          side: string
          status: string
          stop_price: number | null
          symbol: string
          updated_at: string
          user_id: string
        }
        Insert: {
          average_fill_price?: number | null
          canceled_at?: string | null
          commission?: number | null
          created_at?: string
          filled_at?: string | null
          filled_quantity?: number | null
          id?: string
          order_type: string
          placed_at?: string
          portfolio_id: string
          price?: number | null
          quantity: number
          rejection_reason?: string | null
          side: string
          status?: string
          stop_price?: number | null
          symbol: string
          updated_at?: string
          user_id: string
        }
        Update: {
          average_fill_price?: number | null
          canceled_at?: string | null
          commission?: number | null
          created_at?: string
          filled_at?: string | null
          filled_quantity?: number | null
          id?: string
          order_type?: string
          placed_at?: string
          portfolio_id?: string
          price?: number | null
          quantity?: number
          rejection_reason?: string | null
          side?: string
          status?: string
          stop_price?: number | null
          symbol?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      parental_consents: {
        Row: {
          class_id: string
          consent_status: string
          consent_token: string
          created_at: string
          deletion_requested_at: string | null
          id: string
          parent_email: string
          requested_at: string
          requested_by: string
          responded_at: string | null
          revoked_at: string | null
          student_id: string
          updated_at: string
        }
        Insert: {
          class_id: string
          consent_status?: string
          consent_token?: string
          created_at?: string
          deletion_requested_at?: string | null
          id?: string
          parent_email: string
          requested_at?: string
          requested_by: string
          responded_at?: string | null
          revoked_at?: string | null
          student_id: string
          updated_at?: string
        }
        Update: {
          class_id?: string
          consent_status?: string
          consent_token?: string
          created_at?: string
          deletion_requested_at?: string | null
          id?: string
          parent_email?: string
          requested_at?: string
          requested_by?: string
          responded_at?: string | null
          revoked_at?: string | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "parental_consents_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      pattern_insights: {
        Row: {
          category: string
          created_at: string
          difficulty: string
          id: string
          insight_text: string
          pattern_id: string
          pattern_name: string
        }
        Insert: {
          category?: string
          created_at?: string
          difficulty?: string
          id?: string
          insight_text: string
          pattern_id: string
          pattern_name: string
        }
        Update: {
          category?: string
          created_at?: string
          difficulty?: string
          id?: string
          insight_text?: string
          pattern_id?: string
          pattern_name?: string
        }
        Relationships: []
      }
      portfolio_assets: {
        Row: {
          asset_name: string
          asset_type: string
          created_at: string
          current_price: number
          id: string
          portfolio_id: string
          purchase_price: number
          quantity: number
          updated_at: string
        }
        Insert: {
          asset_name: string
          asset_type: string
          created_at?: string
          current_price: number
          id?: string
          portfolio_id: string
          purchase_price: number
          quantity: number
          updated_at?: string
        }
        Update: {
          asset_name?: string
          asset_type?: string
          created_at?: string
          current_price?: number
          id?: string
          portfolio_id?: string
          purchase_price?: number
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_assets_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          buying_power: number | null
          cash_balance: number
          created_at: string
          id: string
          total_value: number
          unsettled_cash: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          buying_power?: number | null
          cash_balance?: number
          created_at?: string
          id?: string
          total_value?: number
          unsettled_cash?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          buying_power?: number | null
          cash_balance?: number
          created_at?: string
          id?: string
          total_value?: number
          unsettled_cash?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          category: string | null
          comments_count: number
          content: string
          created_at: string
          id: string
          image_url: string | null
          likes_count: number
          media_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          comments_count?: number
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number
          media_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          comments_count?: number
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number
          media_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          coins: number
          created_at: string
          display_name: string | null
          experience_points: number
          id: string
          level: number
          mentor_mode_enabled: boolean
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          coins?: number
          created_at?: string
          display_name?: string | null
          experience_points?: number
          id: string
          level?: number
          mentor_mode_enabled?: boolean
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          coins?: number
          created_at?: string
          display_name?: string | null
          experience_points?: number
          id?: string
          level?: number
          mentor_mode_enabled?: boolean
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      seasonal_themes: {
        Row: {
          bonus_rewards: Json | null
          color_scheme: Json
          created_at: string
          description: string | null
          end_date: string
          id: string
          is_active: boolean
          name: string
          particle_effects: Json | null
          start_date: string
          theme_id: string
          updated_at: string
        }
        Insert: {
          bonus_rewards?: Json | null
          color_scheme?: Json
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean
          name: string
          particle_effects?: Json | null
          start_date: string
          theme_id: string
          updated_at?: string
        }
        Update: {
          bonus_rewards?: Json | null
          color_scheme?: Json
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean
          name?: string
          particle_effects?: Json | null
          start_date?: string
          theme_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      session_attendance: {
        Row: {
          duration_minutes: number | null
          id: string
          joined_at: string
          left_at: string | null
          participation_score: number | null
          session_id: string
          user_id: string
        }
        Insert: {
          duration_minutes?: number | null
          id?: string
          joined_at?: string
          left_at?: string | null
          participation_score?: number | null
          session_id: string
          user_id: string
        }
        Update: {
          duration_minutes?: number | null
          id?: string
          joined_at?: string
          left_at?: string | null
          participation_score?: number | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_attendance_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      settlements: {
        Row: {
          amount: number
          created_at: string
          id: string
          order_id: string
          portfolio_id: string
          settled_at: string | null
          settlement_date: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          order_id: string
          portfolio_id: string
          settled_at?: string | null
          settlement_date: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          order_id?: string
          portfolio_id?: string
          settled_at?: string | null
          settlement_date?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      stocks: {
        Row: {
          created_at: string
          description: string | null
          exchange: string
          id: string
          industry: string | null
          market_cap: number | null
          name: string
          sector: string | null
          symbol: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          exchange: string
          id?: string
          industry?: string | null
          market_cap?: number | null
          name: string
          sector?: string | null
          symbol: string
        }
        Update: {
          created_at?: string
          description?: string | null
          exchange?: string
          id?: string
          industry?: string | null
          market_cap?: number | null
          name?: string
          sector?: string | null
          symbol?: string
        }
        Relationships: []
      }
      streaks: {
        Row: {
          created_at: string
          current_streak: number
          freeze_used_today: boolean
          id: string
          last_login_date: string | null
          longest_streak: number
          milestone_100: boolean
          milestone_30: boolean
          milestone_365: boolean
          milestone_7: boolean
          streak_freezes: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          freeze_used_today?: boolean
          id?: string
          last_login_date?: string | null
          longest_streak?: number
          milestone_100?: boolean
          milestone_30?: boolean
          milestone_365?: boolean
          milestone_7?: boolean
          streak_freezes?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          freeze_used_today?: boolean
          id?: string
          last_login_date?: string | null
          longest_streak?: number
          milestone_100?: boolean
          milestone_30?: boolean
          milestone_365?: boolean
          milestone_7?: boolean
          streak_freezes?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_activity: {
        Row: {
          class_id: string | null
          completion_percentage: number
          created_at: string
          current_lesson_id: string | null
          id: string
          is_online: boolean
          last_active_at: string
          last_interaction_type: string | null
          lesson_title: string | null
          session_started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          class_id?: string | null
          completion_percentage?: number
          created_at?: string
          current_lesson_id?: string | null
          id?: string
          is_online?: boolean
          last_active_at?: string
          last_interaction_type?: string | null
          lesson_title?: string | null
          session_started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          class_id?: string | null
          completion_percentage?: number
          created_at?: string
          current_lesson_id?: string | null
          id?: string
          is_online?: boolean
          last_active_at?: string
          last_interaction_type?: string | null
          lesson_title?: string | null
          session_started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_activity_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_activity_current_lesson_id_fkey"
            columns: ["current_lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_logs: {
        Row: {
          amount: number | null
          balance_after: number | null
          balance_before: number | null
          created_at: string
          description: string
          fee: number | null
          id: string
          order_id: string | null
          portfolio_id: string
          price: number | null
          quantity: number | null
          symbol: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          balance_after?: number | null
          balance_before?: number | null
          created_at?: string
          description: string
          fee?: number | null
          id?: string
          order_id?: string | null
          portfolio_id: string
          price?: number | null
          quantity?: number | null
          symbol?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number | null
          balance_after?: number | null
          balance_before?: number | null
          created_at?: string
          description?: string
          fee?: number | null
          id?: string
          order_id?: string | null
          portfolio_id?: string
          price?: number | null
          quantity?: number | null
          symbol?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_hearts: {
        Row: {
          created_at: string
          hearts_earned_today: number
          hearts_remaining: number
          id: string
          last_reset_date: string
          max_hearts: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hearts_earned_today?: number
          hearts_remaining?: number
          id?: string
          last_reset_date?: string
          max_hearts?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hearts_earned_today?: number
          hearts_remaining?: number
          id?: string
          last_reset_date?: string
          max_hearts?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_lesson_progress: {
        Row: {
          challenge_history: Json | null
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          last_challenge_at: string | null
          lesson_id: string
          mastery_level: string | null
          progress: number
          quiz_attempts: number | null
          quiz_score: number | null
          updated_at: string
          user_id: string
          weak_areas: Json | null
        }
        Insert: {
          challenge_history?: Json | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          last_challenge_at?: string | null
          lesson_id: string
          mastery_level?: string | null
          progress?: number
          quiz_attempts?: number | null
          quiz_score?: number | null
          updated_at?: string
          user_id: string
          weak_areas?: Json | null
        }
        Update: {
          challenge_history?: Json | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          last_challenge_at?: string | null
          lesson_id?: string
          mastery_level?: string | null
          progress?: number
          quiz_attempts?: number | null
          quiz_score?: number | null
          updated_at?: string
          user_id?: string
          weak_areas?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_onboarding: {
        Row: {
          completed_at: string
          id: string
          investment_level: string
          preferences: Json | null
          quiz_score: number
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          investment_level: string
          preferences?: Json | null
          quiz_score: number
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          investment_level?: string
          preferences?: Json | null
          quiz_score?: number
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_seen_insights: {
        Row: {
          id: string
          insight_id: string
          seen_at: string
          user_id: string
        }
        Insert: {
          id?: string
          insight_id: string
          seen_at?: string
          user_id: string
        }
        Update: {
          id?: string
          insight_id?: string
          seen_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_seen_insights_insight_id_fkey"
            columns: ["insight_id"]
            isOneToOne: false
            referencedRelation: "pattern_insights"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_level_thresholds: {
        Row: {
          created_at: string
          level: number
          rewards: Json | null
          title: string
          xp_required: number
        }
        Insert: {
          created_at?: string
          level: number
          rewards?: Json | null
          title: string
          xp_required: number
        }
        Update: {
          created_at?: string
          level?: number
          rewards?: Json | null
          title?: string
          xp_required?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_experience_points: {
        Args: { user_id_param: string; xp_amount: number }
        Returns: Json
      }
      calculate_level_from_xp: { Args: { xp: number }; Returns: number }
      cleanup_lti_nonces: { Args: never; Returns: undefined }
      generate_class_code: { Args: never; Returns: string }
      get_educator_user_stats: {
        Args: never
        Returns: {
          active_users_7d: number
          avg_lesson_completion: number
          avg_quiz_score: number
          total_lessons_completed: number
          total_users: number
        }[]
      }
      get_struggling_users: {
        Args: never
        Returns: {
          avg_progress: number
          display_name: string
          email: string
          last_active: string
          lessons_completed: number
          lessons_started: number
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_coins: {
        Args: { amount: number; user_id_param: string }
        Returns: number
      }
      is_class_educator: {
        Args: { _class_id: string; _user_id: string }
        Returns: boolean
      }
      is_class_member: {
        Args: { _class_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "educator" | "mentor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "educator", "mentor"],
    },
  },
} as const
