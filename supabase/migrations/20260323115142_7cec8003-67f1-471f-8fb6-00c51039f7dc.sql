-- Drop the restrictive member-only policy and replace with open SELECT for all authenticated users
DROP POLICY IF EXISTS "Members can view own record" ON public.members;

CREATE POLICY "Authenticated users can view all members"
ON public.members
FOR SELECT
TO authenticated
USING (true);