
-- Add new columns to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS reposts_count integer NOT NULL DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS views_count integer NOT NULL DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS edited_at timestamptz;

-- Add likes_count to comments
ALTER TABLE comments ADD COLUMN IF NOT EXISTS likes_count integer NOT NULL DEFAULT 0;

-- Reposts table
CREATE TABLE IF NOT EXISTS reposts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);
ALTER TABLE reposts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reposts" ON reposts FOR SELECT USING (true);
CREATE POLICY "Users can create reposts" ON reposts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reposts" ON reposts FOR DELETE USING (auth.uid() = user_id);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Post views table (unique views)
CREATE TABLE IF NOT EXISTS post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view post_views count" ON post_views FOR SELECT USING (true);
CREATE POLICY "Users can insert own views" ON post_views FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Comment likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  comment_id uuid NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, comment_id)
);
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view comment likes" ON comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can like comments" ON comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike comments" ON comment_likes FOR DELETE USING (auth.uid() = user_id);

-- Trigger: update reposts_count
CREATE OR REPLACE FUNCTION update_post_reposts_count() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET reposts_count = reposts_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET reposts_count = reposts_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;
CREATE TRIGGER on_repost_change AFTER INSERT OR DELETE ON reposts FOR EACH ROW EXECUTE FUNCTION update_post_reposts_count();

-- Trigger: update views_count
CREATE OR REPLACE FUNCTION update_post_views_count() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE posts SET views_count = views_count + 1 WHERE id = NEW.post_id;
  RETURN NULL;
END;
$$;
CREATE TRIGGER on_view_insert AFTER INSERT ON post_views FOR EACH ROW EXECUTE FUNCTION update_post_views_count();

-- Trigger: update comment likes_count
CREATE OR REPLACE FUNCTION update_comment_likes_count() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE comments SET likes_count = likes_count - 1 WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$$;
CREATE TRIGGER on_comment_like_change AFTER INSERT OR DELETE ON comment_likes FOR EACH ROW EXECUTE FUNCTION update_comment_likes_count();

-- Notification: on post like
CREATE OR REPLACE FUNCTION notify_on_post_like() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  liker_name TEXT;
  post_owner_id UUID;
  post_preview TEXT;
BEGIN
  SELECT user_id, LEFT(content, 50) INTO post_owner_id, post_preview FROM posts WHERE id = NEW.post_id;
  IF post_owner_id IS NULL OR post_owner_id = NEW.user_id THEN RETURN NEW; END IF;
  SELECT display_name INTO liker_name FROM profiles WHERE id = NEW.user_id;
  INSERT INTO notifications (user_id, title, message, notification_type, category, icon)
  VALUES (post_owner_id, COALESCE(liker_name, 'Someone') || ' liked your post', COALESCE(post_preview, ''), 'social', 'info', '❤️');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_post_liked AFTER INSERT ON likes FOR EACH ROW EXECUTE FUNCTION notify_on_post_like();

-- Notification: on post comment
CREATE OR REPLACE FUNCTION notify_on_post_comment() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  commenter_name TEXT;
  post_owner_id UUID;
BEGIN
  SELECT user_id INTO post_owner_id FROM posts WHERE id = NEW.post_id;
  IF post_owner_id IS NULL OR post_owner_id = NEW.user_id THEN RETURN NEW; END IF;
  SELECT display_name INTO commenter_name FROM profiles WHERE id = NEW.user_id;
  INSERT INTO notifications (user_id, title, message, notification_type, category, icon)
  VALUES (post_owner_id, COALESCE(commenter_name, 'Someone') || ' commented on your post', LEFT(NEW.content, 60), 'social', 'info', '💬');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_post_commented AFTER INSERT ON comments FOR EACH ROW EXECUTE FUNCTION notify_on_post_comment();

-- Notification: on repost
CREATE OR REPLACE FUNCTION notify_on_post_repost() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  reposter_name TEXT;
  post_owner_id UUID;
BEGIN
  SELECT user_id INTO post_owner_id FROM posts WHERE id = NEW.post_id;
  IF post_owner_id IS NULL OR post_owner_id = NEW.user_id THEN RETURN NEW; END IF;
  SELECT display_name INTO reposter_name FROM profiles WHERE id = NEW.user_id;
  INSERT INTO notifications (user_id, title, message, notification_type, category, icon)
  VALUES (post_owner_id, COALESCE(reposter_name, 'Someone') || ' reposted your post', '', 'social', 'info', '🔁');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_post_reposted AFTER INSERT ON reposts FOR EACH ROW EXECUTE FUNCTION notify_on_post_repost();

-- Enable realtime for social tables
ALTER PUBLICATION supabase_realtime ADD TABLE posts;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
ALTER PUBLICATION supabase_realtime ADD TABLE likes;
ALTER PUBLICATION supabase_realtime ADD TABLE reposts;
