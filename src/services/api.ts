import { supabase } from "@/integrations/supabase/client";

export const formatCurrency = (amount: number, currency = "RWF") => {
  return new Intl.NumberFormat("en-RW", { style: "currency", currency }).format(amount);
};

// Admin Dashboard Summary
export async function getAdminDashboardSummary() {
  const { data, error } = await supabase.rpc("get_admin_dashboard_summary");
  if (error) throw error;
  return data?.[0] ?? {
    total_members: 0,
    total_expected: 0,
    total_collected: 0,
    outstanding: 0,
    fully_paid_count: 0,
    pending_count: 0,
    overdue_count: 0,
  };
}

// Members
export async function getMembers() {
  const { data, error } = await supabase.from("members").select("*").order("first_name");
  if (error) throw error;
  return data ?? [];
}

export async function getMemberById(id: string) {
  const { data, error } = await supabase.from("members").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getMemberByUserId(userId: string) {
  const { data, error } = await supabase.from("members").select("*").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

// Members with computed balances
export async function getMembersWithBalances() {
  const { data: members, error: mErr } = await supabase.from("members").select("*").order("first_name");
  if (mErr) throw mErr;
  
  const { data: txns, error: tErr } = await supabase
    .from("transactions")
    .select("member_id, amount, status");
  if (tErr) throw tErr;

  return (members ?? []).map((m) => {
    const totalPaid = (txns ?? [])
      .filter((t) => t.member_id === m.id && t.status === "completed")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const remaining = Math.max(0, Number(m.agreed_contribution_amount) - totalPaid);
    const computedStatus = totalPaid >= Number(m.agreed_contribution_amount)
      ? "paid"
      : totalPaid > 0
      ? "partial"
      : "pending";
    return { ...m, totalPaid, balanceRemaining: remaining, computedStatus };
  });
}

// Transactions
export async function getTransactions() {
  const { data, error } = await supabase
    .from("transactions")
    .select("*, members(first_name, last_name)")
    .order("date", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((t) => ({
    ...t,
    memberName: t.members ? `${t.members.first_name} ${t.members.last_name}` : "Unknown",
  }));
}

export async function getTransactionsByMember(memberId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*, members(first_name, last_name)")
    .eq("member_id", memberId)
    .order("date", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((t) => ({
    ...t,
    memberName: t.members ? `${t.members.first_name} ${t.members.last_name}` : "Unknown",
  }));
}

export async function createTransaction(data: {
  member_id: string;
  amount: number;
  date: string;
  payment_method: "cash" | "bank_transfer" | "mobile_money" | "check" | "other";
  status: "completed" | "pending";
  entered_by: string;
  reference?: string;
  notes?: string;
}) {
  const { data: result, error } = await supabase
    .from("transactions")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return result;
}

// Contribution Plans
export async function getContributionPlans() {
  const { data, error } = await supabase
    .from("contribution_plans")
    .select("*")
    .order("effective_date", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createContributionPlan(plan: {
  amount: number;
  frequency: "weekly" | "biweekly" | "monthly" | "quarterly";
  effective_date: string;
  notes?: string;
  created_by: string;
}) {
  // Deactivate current active plans
  await supabase
    .from("contribution_plans")
    .update({ is_active: false, end_date: plan.effective_date })
    .eq("is_active", true);

  const { data, error } = await supabase
    .from("contribution_plans")
    .insert({ ...plan, is_active: true, currency: "RWF" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Notifications
export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// Profile
export async function updateProfile(userId: string, updates: {
  first_name?: string;
  last_name?: string;
  phone?: string;
}) {
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", userId);
  if (error) throw error;
}

// Get entered-by name
export async function getProfileName(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("user_id", userId)
    .maybeSingle();
  return data ? `${data.first_name} ${data.last_name}` : "Unknown";
}
