-- Run this in the Supabase SQL Editor to enable full-text search
-- This adds a tsvector column and a search function for faster queries

-- Add full-text search column
ALTER TABLE posts ADD COLUMN IF NOT EXISTS fts tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(short_description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C')
  ) STORED;

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_posts_fts ON posts USING GIN (fts);

-- Search function that returns posts ranked by relevance
CREATE OR REPLACE FUNCTION search_posts(query text)
RETURNS SETOF posts
LANGUAGE sql
STABLE
AS $$
  SELECT *
  FROM posts
  WHERE published = true
    AND fts @@ plainto_tsquery('english', query)
  ORDER BY ts_rank(fts, plainto_tsquery('english', query)) DESC
  LIMIT 50;
$$;
