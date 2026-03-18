
-- Enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'member');

-- Enum for payment status
CREATE TYPE public.payment_status AS ENUM ('paid', 'pending', 'partial', 'overdue');

-- Enum for transaction status  
CREATE TYPE public.transaction_status AS ENUM ('completed', 'pending', 'failed', 'reversed');

-- Enum for payment method
CREATE TYPE public.payment_method AS ENUM ('cash', 'bank_transfer', 'mobile_money', 'check', 'other');

-- Enum for frequency
CREATE TYPE public.contribution_frequency AS ENUM ('weekly', 'biweekly', 'monthly', 'quarterly');

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- User roles table (separate from profiles per security best practice)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Members table (linked to a user, managed by admin)
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  agreed_contribution_amount NUMERIC NOT NULL DEFAULT 0,
  status public.payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do everything with members" ON public.members FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Members can view own record" ON public.members FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Contribution plans table
CREATE TABLE public.contribution_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'RWF',
  frequency public.contribution_frequency NOT NULL DEFAULT 'monthly',
  effective_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contribution_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view contribution plans" ON public.contribution_plans FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage contribution plans" ON public.contribution_plans FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contribution plans" ON public.contribution_plans FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_contribution_plans_updated_at BEFORE UPDATE ON public.contribution_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'RWF',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method public.payment_method NOT NULL DEFAULT 'cash',
  entered_by UUID REFERENCES auth.users(id),
  status public.transaction_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do everything with transactions" ON public.transactions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Members can view own transactions" ON public.transactions FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.members WHERE members.id = transactions.member_id AND members.user_id = auth.uid())
);

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can create notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get admin dashboard summary
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_summary()
RETURNS TABLE(
  total_members BIGINT,
  total_expected NUMERIC,
  total_collected NUMERIC,
  outstanding NUMERIC,
  fully_paid_count BIGINT,
  pending_count BIGINT,
  overdue_count BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH member_stats AS (
    SELECT 
      m.id,
      m.agreed_contribution_amount,
      COALESCE(SUM(t.amount) FILTER (WHERE t.status = 'completed'), 0) AS paid,
      CASE 
        WHEN COALESCE(SUM(t.amount) FILTER (WHERE t.status = 'completed'), 0) >= m.agreed_contribution_amount THEN 'paid'
        WHEN COALESCE(SUM(t.amount) FILTER (WHERE t.status = 'completed'), 0) > 0 THEN 'partial'
        ELSE 'pending'
      END AS computed_status
    FROM public.members m
    LEFT JOIN public.transactions t ON t.member_id = m.id
    GROUP BY m.id, m.agreed_contribution_amount
  )
  SELECT
    COUNT(*)::BIGINT AS total_members,
    COALESCE(SUM(agreed_contribution_amount), 0) AS total_expected,
    COALESCE(SUM(paid), 0) AS total_collected,
    COALESCE(SUM(agreed_contribution_amount) - SUM(paid), 0) AS outstanding,
    COUNT(*) FILTER (WHERE computed_status = 'paid')::BIGINT AS fully_paid_count,
    COUNT(*) FILTER (WHERE computed_status = 'partial')::BIGINT AS pending_count,
    COUNT(*) FILTER (WHERE computed_status = 'pending')::BIGINT AS overdue_count
  FROM member_stats;
$$;
