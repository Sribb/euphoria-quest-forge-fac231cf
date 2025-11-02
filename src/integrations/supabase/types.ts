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
          id: string
          level: number
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          coins?: number
          created_at?: string
          display_name?: string | null
          id: string
          level?: number
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          coins?: number
          created_at?: string
          display_name?: string | null
          id?: string
          level?: number
          updated_at?: string
          username?: string | null
        }
        Relationships: []
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
          id: string
          last_login_date: string | null
          longest_streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_login_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_login_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      user_lesson_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string
          progress: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          progress?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          progress?: number
          updated_at?: string
          user_id?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
