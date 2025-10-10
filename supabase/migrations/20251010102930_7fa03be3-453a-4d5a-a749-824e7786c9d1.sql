-- Create rewards table
CREATE TABLE public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL CHECK (points_required > 0),
  type TEXT NOT NULL,
  image_url TEXT,
  partner_id UUID REFERENCES public.partners(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create redemptions table
CREATE TABLE public.redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  reward_id UUID NOT NULL REFERENCES public.rewards(id),
  points_spent INTEGER NOT NULL,
  qr_code_data TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  redeemed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;

-- RLS policies for rewards
CREATE POLICY "Everyone can view active rewards"
ON public.rewards FOR SELECT
USING (active = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage rewards"
ON public.rewards FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for redemptions
CREATE POLICY "Users can view own redemptions"
ON public.redemptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own redemptions"
ON public.redemptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all redemptions"
ON public.redemptions FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update redemptions"
ON public.redemptions FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_rewards_updated_at
BEFORE UPDATE ON public.rewards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Add sample rewards
INSERT INTO public.rewards (name, description, points_required, type, image_url) VALUES
('10% Discount Coupon', 'Get 10% off your next donation pickup', 100, 'discount', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400'),
('Plant a Tree', 'Sponsor planting one tree in your community', 250, 'tree_planting', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400'),
('Eco-Friendly Tote Bag', 'Reusable shopping bag made from recycled materials', 300, 'product', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400'),
('Partner Shop Voucher', '500 INR voucher at participating partner shops', 500, 'partner_offer', 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400');