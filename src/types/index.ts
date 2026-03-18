export type UserRole = "admin" | "member";

export type PaymentStatus = "paid" | "pending" | "partial" | "overdue";
export type TransactionStatus = "completed" | "pending" | "failed" | "reversed";
export type PaymentMethod = "cash" | "bank_transfer" | "mobile_money" | "check" | "other";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Member {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  joinDate: string;
  agreedContributionAmount: number;
  totalPaid: number;
  balanceRemaining: number;
  status: PaymentStatus;
  avatarUrl?: string;
}

export interface ContributionPlan {
  id: string;
  amount: number;
  currency: string;
  frequency: "monthly" | "weekly" | "biweekly" | "quarterly";
  effectiveDate: string;
  endDate?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  currency: string;
  date: string;
  paymentMethod: PaymentMethod;
  enteredBy: string;
  status: TransactionStatus;
  notes?: string;
  reference?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  createdAt: string;
}

export interface DashboardSummary {
  totalMembers: number;
  totalExpectedContributions: number;
  totalCollected: number;
  outstandingBalance: number;
  fullyPaidCount: number;
  pendingCount: number;
  overdueCount: number;
  currency: string;
}

export interface MemberDashboardSummary {
  agreedAmount: number;
  totalPaid: number;
  remainingBalance: number;
  paymentStatus: PaymentStatus;
  currency: string;
  nextDueDate?: string;
}
