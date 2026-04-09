-- Run this in the Supabase SQL Editor to enable post scheduling

-- Add publish_at column for scheduled posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS publish_at timestamptz;

-- Create index for scheduled post queries
CREATE INDEX IF NOT EXISTS idx_posts_publish_at ON posts (publish_at) WHERE publish_at IS NOT NULL AND published = false;

-- Function to auto-publish scheduled posts (run via pg_cron or Supabase Edge Function)
CREATE OR REPLACE FUNCTION publish_scheduled_posts()
RETURNS void
LANGUAGE sql
AS $$
  UPDATE posts
  SET published = true, updated_at = now()
  WHERE publish_at IS NOT NULL
    AND publish_at <= now()
    AND published = false;
$$;

-- Optional: Enable pg_cron and schedule auto-publish every minute
-- Uncomment these lines if you have pg_cron enabled:
-- SELECT cron.schedule('publish-scheduled', '* * * * *', 'SELECT publish_scheduled_posts()');
