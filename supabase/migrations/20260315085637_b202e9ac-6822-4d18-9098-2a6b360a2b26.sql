
-- direct_messages was already in realtime publication, just add the new tables
-- (conversations and message_requests were added successfully in previous migration)
-- This is a no-op fix migration
SELECT 1;
