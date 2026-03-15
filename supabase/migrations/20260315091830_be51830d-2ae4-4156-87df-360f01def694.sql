
-- Create a trigger function to auto-create notifications for new messages
CREATE OR REPLACE FUNCTION public.notify_on_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  sender_name TEXT;
  preview TEXT;
BEGIN
  -- Only notify the receiver, not the sender
  IF NEW.sender_id = NEW.receiver_id THEN
    RETURN NEW;
  END IF;

  -- Get sender display name
  SELECT display_name INTO sender_name
  FROM public.profiles
  WHERE id = NEW.sender_id;

  sender_name := COALESCE(sender_name, 'Someone');
  
  -- Create message preview (truncate to 60 chars)
  preview := LEFT(NEW.content, 60);
  IF LENGTH(NEW.content) > 60 THEN
    preview := preview || '…';
  END IF;

  -- Insert notification for receiver
  INSERT INTO public.notifications (
    user_id, title, message, notification_type, category, icon, action_url, is_read
  ) VALUES (
    NEW.receiver_id,
    sender_name || ' sent you a message',
    preview,
    'message',
    'info',
    '💬',
    'community?conversation=' || COALESCE(NEW.conversation_id::text, ''),
    false
  );

  RETURN NEW;
END;
$$;

-- Create trigger on direct_messages
CREATE TRIGGER on_new_direct_message_notify
  AFTER INSERT ON public.direct_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_new_message();
