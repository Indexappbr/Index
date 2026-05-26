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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_config: {
        Row: {
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_ip: unknown
          created_at: string
          details: Json | null
          id: string
          object_id: string | null
          object_type: string | null
          severity: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_ip?: unknown
          created_at?: string
          details?: Json | null
          id?: string
          object_id?: string | null
          object_type?: string | null
          severity?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_ip?: unknown
          created_at?: string
          details?: Json | null
          id?: string
          object_id?: string | null
          object_type?: string | null
          severity?: string
        }
        Relationships: []
      }
      auth_mfa_recovery_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          used: boolean | null
          used_at: string | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          used?: boolean | null
          used_at?: string | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          used?: boolean | null
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auth_mfa_recovery_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_rate_limits: {
        Row: {
          action: string
          id: string
          last_request: string | null
          requests: number | null
          subject: string
          window_seconds: number | null
        }
        Insert: {
          action: string
          id?: string
          last_request?: string | null
          requests?: number | null
          subject: string
          window_seconds?: number | null
        }
        Update: {
          action?: string
          id?: string
          last_request?: string | null
          requests?: number | null
          subject?: string
          window_seconds?: number | null
        }
        Relationships: []
      }
      banners: {
        Row: {
          content: Json | null
          created_at: string
          id: string
          image_path: string | null
          is_active: boolean
          order_index: number
          target_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          id?: string
          image_path?: string | null
          is_active?: boolean
          order_index?: number
          target_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          id?: string
          image_path?: string | null
          is_active?: boolean
          order_index?: number
          target_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blocked_ips: {
        Row: {
          blocked_until: string | null
          created_at: string
          id: string
          ip: unknown
          reason: string | null
        }
        Insert: {
          blocked_until?: string | null
          created_at?: string
          id?: string
          ip: unknown
          reason?: string | null
        }
        Update: {
          blocked_until?: string | null
          created_at?: string
          id?: string
          ip?: unknown
          reason?: string | null
        }
        Relationships: []
      }
      book_categories: {
        Row: {
          book_id: string
          category_id: string
          created_at: string
          id: string
          order_index: number
        }
        Insert: {
          book_id: string
          category_id: string
          created_at?: string
          id?: string
          order_index?: number
        }
        Update: {
          book_id?: string
          category_id?: string
          created_at?: string
          id?: string
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "book_categories_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_categories_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          authors: string[]
          categories: string[]
          cover_storage_path: string | null
          cover_thumb_storage_path: string | null
          cover_thumb_url: string | null
          cover_url: string | null
          created_at: string
          created_by: string | null
          description: string
          duration_seconds: number | null
          id: string
          is_free: boolean
          is_published: boolean
          language: string
          published_at: string | null
          publisher: string | null
          search_metadata: Json | null
          search_vector: unknown
          slug: string
          subtitle: string | null
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          authors?: string[]
          categories?: string[]
          cover_storage_path?: string | null
          cover_thumb_storage_path?: string | null
          cover_thumb_url?: string | null
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          duration_seconds?: number | null
          id?: string
          is_free?: boolean
          is_published?: boolean
          language?: string
          published_at?: string | null
          publisher?: string | null
          search_metadata?: Json | null
          search_vector?: unknown
          slug: string
          subtitle?: string | null
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          authors?: string[]
          categories?: string[]
          cover_storage_path?: string | null
          cover_thumb_storage_path?: string | null
          cover_thumb_url?: string | null
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          duration_seconds?: number | null
          id?: string
          is_free?: boolean
          is_published?: boolean
          language?: string
          published_at?: string | null
          publisher?: string | null
          search_metadata?: Json | null
          search_vector?: unknown
          slug?: string
          subtitle?: string | null
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          level: number
          min_plan: string
          name: string
          order_index: number
          slug: string
          updated_at: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          level?: number
          min_plan?: string
          name: string
          order_index?: number
          slug: string
          updated_at?: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          level?: number
          min_plan?: string
          name?: string
          order_index?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      chapter_tracks: {
        Row: {
          audio_storage_path: string | null
          audio_url: string
          chapter_id: string
          created_at: string
          duration: string
          id: string
          title: string
          track_number: number
        }
        Insert: {
          audio_storage_path?: string | null
          audio_url?: string
          chapter_id: string
          created_at?: string
          duration?: string
          id?: string
          title: string
          track_number?: number
        }
        Update: {
          audio_storage_path?: string | null
          audio_url?: string
          chapter_id?: string
          created_at?: string
          duration?: string
          id?: string
          title?: string
          track_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "chapter_tracks_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapter_tracks_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters_public"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          audio_storage_path: string | null
          audio_url: string | null
          book_id: string
          created_at: string
          file_checksum: string | null
          id: string
          is_locked: boolean
          length_seconds: number | null
          mime_type: string | null
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          audio_storage_path?: string | null
          audio_url?: string | null
          book_id: string
          created_at?: string
          file_checksum?: string | null
          id?: string
          is_locked?: boolean
          length_seconds?: number | null
          mime_type?: string | null
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          audio_storage_path?: string | null
          audio_url?: string | null
          book_id?: string
          created_at?: string
          file_checksum?: string | null
          id?: string
          is_locked?: boolean
          length_seconds?: number | null
          mime_type?: string | null
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_public"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          id: string
          stripe_customer_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          stripe_customer_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          stripe_customer_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      entitlements: {
        Row: {
          chapter_id: string
          created_at: string
          id: string
          source: string
          user_id: string
          valid_until: string | null
        }
        Insert: {
          chapter_id: string
          created_at?: string
          id?: string
          source?: string
          user_id: string
          valid_until?: string | null
        }
        Update: {
          chapter_id?: string
          created_at?: string
          id?: string
          source?: string
          user_id?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entitlements_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entitlements_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entitlements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          book_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ingestion_jobs: {
        Row: {
          attempts: number
          book_id: string | null
          created_at: string
          error_message: string | null
          id: string
          payload: Json
          status: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          book_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          payload?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          book_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          payload?: Json
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingestion_jobs_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ingestion_jobs_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_public"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_due: number
          created_at: string
          currency: string
          hosted_invoice_url: string | null
          id: string
          pdf_url: string | null
          period_end: string | null
          period_start: string | null
          status: string
          stripe_invoice_id: string | null
          user_id: string
        }
        Insert: {
          amount_due?: number
          created_at?: string
          currency?: string
          hosted_invoice_url?: string | null
          id?: string
          pdf_url?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: string
          stripe_invoice_id?: string | null
          user_id: string
        }
        Update: {
          amount_due?: number
          created_at?: string
          currency?: string
          hosted_invoice_url?: string | null
          id?: string
          pdf_url?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: string
          stripe_invoice_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      playback_positions: {
        Row: {
          chapter_id: string
          device_id: string | null
          device_meta: Json | null
          id: string
          position_seconds: number
          updated_at: string
          user_id: string
        }
        Insert: {
          chapter_id: string
          device_id?: string | null
          device_meta?: Json | null
          id?: string
          position_seconds?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          chapter_id?: string
          device_id?: string | null
          device_meta?: Json | null
          id?: string
          position_seconds?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playback_positions_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playback_positions_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playback_positions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          keys: Json
          last_seen: string | null
          platform: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          keys?: Json
          last_seen?: string | null
          platform?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          keys?: Json
          last_seen?: string | null
          platform?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      search_logs: {
        Row: {
          created_at: string
          filters: Json | null
          id: string
          ip: unknown
          query: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          filters?: Json | null
          id?: string
          ip?: unknown
          query: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          filters?: Json | null
          id?: string
          ip?: unknown
          query?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sliders: {
        Row: {
          book_id: string | null
          created_at: string
          id: string
          image_path: string | null
          is_active: boolean
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          book_id?: string | null
          created_at?: string
          id?: string
          image_path?: string | null
          is_active?: boolean
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          book_id?: string | null
          created_at?: string
          id?: string
          image_path?: string | null
          is_active?: boolean
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sliders_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sliders_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_public"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_webhook_events: {
        Row: {
          event_type: string
          id: string
          processed_at: string
          stripe_event_id: string
        }
        Insert: {
          event_type: string
          id?: string
          processed_at?: string
          stripe_event_id: string
        }
        Update: {
          event_type?: string
          id?: string
          processed_at?: string
          stripe_event_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          metadata: Json | null
          raw_event: Json | null
          status: string
          stripe_price_id: string | null
          stripe_subscription_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json | null
          raw_event?: Json | null
          status?: string
          stripe_price_id?: string | null
          stripe_subscription_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json | null
          raw_event?: Json | null
          status?: string
          stripe_price_id?: string | null
          stripe_subscription_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          id: string
          preferences: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          preferences?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          preferences?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      user_security_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          ip: unknown
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          ip?: unknown
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          ip?: unknown
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_security_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string
          device_name: string | null
          device_type: string | null
          id: string
          ip: unknown
          is_current: boolean | null
          last_active_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_name?: string | null
          device_type?: string | null
          id?: string
          ip?: unknown
          is_current?: boolean | null
          last_active_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_name?: string | null
          device_type?: string | null
          id?: string
          ip?: unknown
          is_current?: boolean | null
          last_active_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          disabled: boolean | null
          display_name: string | null
          email: string | null
          founder_number: number | null
          full_name: string | null
          id: string
          is_founder: boolean
          metadata: Json | null
          phone: string | null
          preferred_language: string | null
          twofa_enabled: boolean | null
          twofa_totp_secret: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          disabled?: boolean | null
          display_name?: string | null
          email?: string | null
          founder_number?: number | null
          full_name?: string | null
          id: string
          is_founder?: boolean
          metadata?: Json | null
          phone?: string | null
          preferred_language?: string | null
          twofa_enabled?: boolean | null
          twofa_totp_secret?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          disabled?: boolean | null
          display_name?: string | null
          email?: string | null
          founder_number?: number | null
          full_name?: string | null
          id?: string
          is_founder?: boolean
          metadata?: Json | null
          phone?: string | null
          preferred_language?: string | null
          twofa_enabled?: boolean | null
          twofa_totp_secret?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      users_external_accounts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          metadata: Json | null
          provider: string
          provider_user_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          metadata?: Json | null
          provider: string
          provider_user_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          metadata?: Json | null
          provider?: string
          provider_user_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_external_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      billing_history: {
        Row: {
          amount_due: number | null
          created_at: string | null
          currency: string | null
          hosted_invoice_url: string | null
          id: string | null
          invoice_status: string | null
          pdf_url: string | null
          period_end: string | null
          period_start: string | null
          stripe_invoice_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      books_public: {
        Row: {
          authors: string[] | null
          categories: string[] | null
          cover_thumb_url: string | null
          cover_url: string | null
          description: string | null
          duration_seconds: number | null
          id: string | null
          is_free: boolean | null
          language: string | null
          published_at: string | null
          publisher: string | null
          slug: string | null
          subtitle: string | null
          tags: string[] | null
          title: string | null
        }
        Insert: {
          authors?: string[] | null
          categories?: string[] | null
          cover_thumb_url?: string | null
          cover_url?: string | null
          description?: string | null
          duration_seconds?: number | null
          id?: string | null
          is_free?: boolean | null
          language?: string | null
          published_at?: string | null
          publisher?: string | null
          slug?: string | null
          subtitle?: string | null
          tags?: string[] | null
          title?: string | null
        }
        Update: {
          authors?: string[] | null
          categories?: string[] | null
          cover_thumb_url?: string | null
          cover_url?: string | null
          description?: string | null
          duration_seconds?: number | null
          id?: string | null
          is_free?: boolean | null
          language?: string | null
          published_at?: string | null
          publisher?: string | null
          slug?: string | null
          subtitle?: string | null
          tags?: string[] | null
          title?: string | null
        }
        Relationships: []
      }
      chapters_public: {
        Row: {
          book_id: string | null
          created_at: string | null
          id: string | null
          is_locked: boolean | null
          length_seconds: number | null
          order_index: number | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_public"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      immutable_array_to_string: {
        Args: { arr: string[]; sep: string }
        Returns: string
      }
      process_ingestion_job: {
        Args: { _error_message?: string; _job_id: string; _status: string }
        Returns: undefined
      }
      write_audit_log: {
        Args: {
          _action?: string
          _actor_id?: string
          _actor_ip?: unknown
          _details?: Json
          _object_id?: string
          _object_type?: string
          _severity?: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
