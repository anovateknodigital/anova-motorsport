-- Add user_id to news table
ALTER TABLE news ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_news_user_id ON news(user_id);

-- Add user_id to site_settings table
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_site_settings_user_id ON site_settings(user_id);

-- Add user_id to youtube_cache table
ALTER TABLE youtube_cache ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_youtube_cache_user_id ON youtube_cache(user_id);
