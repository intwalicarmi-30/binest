import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type AppRole = "admin" | "member";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Tables<"profiles"> | null;
  role: AppRole | null;
  memberId: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  role: null,
  memberId: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    setProfile(profileData);

    // Fetch role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const roles = roleData?.map((r) => r.role) ?? [];
    setRole(roles.includes("admin") ? "admin" : roles[0] ?? null);

    // Fetch member ID if member
    const { data: memberData } = await supabase
      .from("members")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    setMemberId(memberData?.id ?? null);
  };

  useEffect(() => {
    // Set up auth listener BEFORE getSession
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          // Use setTimeout to avoid Supabase deadlock
          setTimeout(() => fetchUserData(session.user.id), 0);
        } else {
          setProfile(null);
          setRole(null);
          setMemberId(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    setRole(null);
    setMemberId(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, role, memberId, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
