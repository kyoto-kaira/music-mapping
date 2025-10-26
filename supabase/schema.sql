-- Music Mapping データベーススキーマ

-- マップテーブル
CREATE TABLE IF NOT EXISTS maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  x_axis TEXT NOT NULL,
  y_axis TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 曲テーブル
CREATE TABLE IF NOT EXISTS songs (
  id TEXT PRIMARY KEY, -- Spotify ID
  map_id UUID NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  spotify_url TEXT,
  preview_url TEXT,
  image_url TEXT,
  x DOUBLE PRECISION NOT NULL,
  y DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(map_id, id)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_songs_map_id ON songs(map_id);
CREATE INDEX IF NOT EXISTS idx_maps_created_at ON maps(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_maps_updated_at ON maps(updated_at DESC);

-- 更新日時を自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_maps_updated_at BEFORE UPDATE ON maps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) の設定
-- 現時点では全てのユーザーがアクセス可能（将来的に認証を追加する場合に備えて）
ALTER TABLE maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- 全ての操作を許可するポリシー（開発用）
CREATE POLICY "Enable all operations for all users" ON maps
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for all users" ON songs
  FOR ALL USING (true) WITH CHECK (true);

