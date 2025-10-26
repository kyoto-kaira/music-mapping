import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using mock mode.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// データベースの型定義
export interface Database {
  public: {
    Tables: {
      maps: {
        Row: {
          id: string;
          name: string;
          x_axis: string;
          y_axis: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          x_axis: string;
          y_axis: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          x_axis?: string;
          y_axis?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      songs: {
        Row: {
          id: string;
          map_id: string;
          title: string;
          artist: string;
          album: string | null;
          spotify_url: string | null;
          preview_url: string | null;
          image_url: string | null;
          x: number;
          y: number;
          created_at: string;
        };
        Insert: {
          id: string;
          map_id: string;
          title: string;
          artist: string;
          album?: string | null;
          spotify_url?: string | null;
          preview_url?: string | null;
          image_url?: string | null;
          x: number;
          y: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          map_id?: string;
          title?: string;
          artist?: string;
          album?: string | null;
          spotify_url?: string | null;
          preview_url?: string | null;
          image_url?: string | null;
          x?: number;
          y?: number;
          created_at?: string;
        };
      };
    };
  };
}

