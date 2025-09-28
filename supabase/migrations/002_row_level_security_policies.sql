-- Row Level Security Policies for Monetization Tables
-- These policies ensure secure access to billing and subscription data

-- Enable RLS on custom tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_plans ENABLE ROW LEVEL SECURITY;

-- User roles policies
-- Users can view their own roles
CREATE POLICY "Users can view own roles" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all roles
CREATE POLICY "Admins can view all roles" ON user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Service role can manage all roles (for webhooks)
CREATE POLICY "Service role can manage roles" ON user_roles
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Billing history policies
-- Users can view their own billing history
CREATE POLICY "Users can view own billing history" ON billing_history
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all billing history
CREATE POLICY "Admins can view all billing history" ON billing_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Service role can insert billing history (for webhooks)
CREATE POLICY "Service role can insert billing history" ON billing_history
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Admin plans policies
-- Everyone can view active plans
CREATE POLICY "Everyone can view active plans" ON admin_plans
  FOR SELECT USING (is_active = true);

-- Admins can manage all plans
CREATE POLICY "Admins can manage plans" ON admin_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Service role can read all plans (for subscription management)
CREATE POLICY "Service role can read plans" ON admin_plans
  FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');
