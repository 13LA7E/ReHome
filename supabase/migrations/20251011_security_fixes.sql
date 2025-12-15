-- Security Fixes Migration
-- This migration addresses critical security vulnerabilities in redemption verification

-- Drop the insecure policies
DROP POLICY IF EXISTS "Allow verification by QR code" ON public.redemptions;
DROP POLICY IF EXISTS "Allow status update during verification" ON public.redemptions;

-- Create a secure function for redemption verification
CREATE OR REPLACE FUNCTION public.verify_redemption(
  verification_code_param TEXT,
  partner_id_param UUID
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  reward_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  redemption_record RECORD;
  reward_record RECORD;
BEGIN
  -- Find the redemption by verification code
  SELECT * INTO redemption_record
  FROM public.redemptions
  WHERE verification_code = verification_code_param
  LIMIT 1;

  -- Check if redemption exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Invalid verification code'::TEXT, ''::TEXT;
    RETURN;
  END IF;

  -- Check if already redeemed
  IF redemption_record.status = 'completed' THEN
    -- Get reward name for already redeemed items
    SELECT name INTO reward_record
    FROM public.rewards
    WHERE id = redemption_record.reward_id;
    
    RETURN QUERY SELECT false, 'This reward has already been redeemed'::TEXT, COALESCE(reward_record.name, '')::TEXT;
    RETURN;
  END IF;

  -- Verify the partner_id matches
  IF redemption_record.partner_id != partner_id_param THEN
    RETURN QUERY SELECT false, 'This redemption code is not valid for this partner'::TEXT, ''::TEXT;
    RETURN;
  END IF;

  -- Get reward name
  SELECT name INTO reward_record
  FROM public.rewards
  WHERE id = redemption_record.reward_id;

  -- Update redemption status to completed
  UPDATE public.redemptions
  SET 
    status = 'completed',
    redeemed_at = NOW()
  WHERE id = redemption_record.id;

  -- Return success
  RETURN QUERY SELECT true, 'Redemption verified successfully'::TEXT, COALESCE(reward_record.name, '')::TEXT;
END;
$$;

-- Grant execute permission to authenticated users and anon (for partner verification)
GRANT EXECUTE ON FUNCTION public.verify_redemption(TEXT, UUID) TO authenticated, anon;

-- Create a secure function for adding item points
CREATE OR REPLACE FUNCTION public.add_item_points(
  item_category TEXT,
  item_confidence NUMERIC,
  item_image_url TEXT,
  item_is_reusable BOOLEAN
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  points_earned INT,
  new_total_points INT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
  points_to_add INT := 10; -- Fixed 10 points per item
  current_metrics RECORD;
  new_item_id UUID;
BEGIN
  -- Get current user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN QUERY SELECT false, 'User not authenticated'::TEXT, 0, 0;
    RETURN;
  END IF;

  -- Validate inputs
  IF item_confidence < 0 OR item_confidence > 1 THEN
    RETURN QUERY SELECT false, 'Invalid confidence value'::TEXT, 0, 0;
    RETURN;
  END IF;

  IF item_category NOT IN ('books', 'clothes', 'electronics', 'ewaste', 'furniture') THEN
    RETURN QUERY SELECT false, 'Invalid category'::TEXT, 0, 0;
    RETURN;
  END IF;

  -- Insert the item
  INSERT INTO public.items (
    user_id,
    category,
    image_url,
    confidence,
    is_reusable,
    status
  ) VALUES (
    current_user_id,
    item_category,
    item_image_url,
    item_confidence,
    item_is_reusable,
    'pending'
  ) RETURNING id INTO new_item_id;

  -- Get current metrics
  SELECT total_items, community_points INTO current_metrics
  FROM public.impact_metrics
  WHERE user_id = current_user_id;

  -- Update metrics
  UPDATE public.impact_metrics
  SET 
    total_items = COALESCE(current_metrics.total_items, 0) + 1,
    community_points = COALESCE(current_metrics.community_points, 0) + points_to_add
  WHERE user_id = current_user_id;

  -- Return success with new totals
  RETURN QUERY SELECT 
    true, 
    'Item added successfully'::TEXT, 
    points_to_add,
    COALESCE(current_metrics.community_points, 0) + points_to_add;
END;
$$;

-- Grant execute permission to authenticated users only
GRANT EXECUTE ON FUNCTION public.add_item_points(TEXT, NUMERIC, TEXT, BOOLEAN) TO authenticated;

-- Create secure function for redeeming rewards
CREATE OR REPLACE FUNCTION public.redeem_reward(
  reward_id_param UUID,
  partner_id_param UUID
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  verification_code TEXT,
  points_remaining INT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
  user_points INT;
  reward_record RECORD;
  new_verification_code TEXT;
  new_points INT;
BEGIN
  -- Get current user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN QUERY SELECT false, 'User not authenticated'::TEXT, ''::TEXT, 0;
    RETURN;
  END IF;

  -- Get user's current points
  SELECT community_points INTO user_points
  FROM public.impact_metrics
  WHERE user_id = current_user_id;

  -- Get reward details
  SELECT * INTO reward_record
  FROM public.rewards
  WHERE id = reward_id_param
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Reward not found'::TEXT, ''::TEXT, COALESCE(user_points, 0);
    RETURN;
  END IF;

  -- Check if user has enough points
  IF COALESCE(user_points, 0) < reward_record.points_required THEN
    RETURN QUERY SELECT false, 'Insufficient points'::TEXT, ''::TEXT, COALESCE(user_points, 0);
    RETURN;
  END IF;

  -- Generate verification code
  new_verification_code := substring(md5(random()::text || clock_timestamp()::text) from 1 for 8);

  -- Insert redemption record
  INSERT INTO public.redemptions (
    user_id,
    reward_id,
    partner_id,
    verification_code,
    status
  ) VALUES (
    current_user_id,
    reward_id_param,
    partner_id_param,
    new_verification_code,
    'pending'
  );

  -- Deduct points
  new_points := user_points - reward_record.points_required;
  
  UPDATE public.impact_metrics
  SET community_points = new_points
  WHERE user_id = current_user_id;

  -- Return success
  RETURN QUERY SELECT 
    true, 
    'Reward redeemed successfully'::TEXT, 
    new_verification_code,
    new_points;
END;
$$;

-- Grant execute permission to authenticated users only
GRANT EXECUTE ON FUNCTION public.redeem_reward(UUID, UUID) TO authenticated;

-- Restrict direct access to redemptions table
-- Users can only see their own redemptions
CREATE POLICY "Users can view own redemptions"
ON public.redemptions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- No direct INSERT, UPDATE, or DELETE on redemptions - use functions only
-- This prevents manipulation

-- Add helpful comments
COMMENT ON FUNCTION public.verify_redemption(TEXT, UUID) IS 'Securely verifies a redemption code for a specific partner';
COMMENT ON FUNCTION public.add_item_points(TEXT, NUMERIC, TEXT, BOOLEAN) IS 'Securely adds an item and awards points with server-side validation';
COMMENT ON FUNCTION public.redeem_reward(UUID, UUID) IS 'Securely redeems a reward and generates verification code';
