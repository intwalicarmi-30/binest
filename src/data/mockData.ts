import type {
  Member,
  ContributionPlan,
  Transaction,
  Notification,
  DashboardSummary,
  MemberDashboardSummary,
  User,
} from "@/types";

export const currentUser: User = {
  id: "u1",
  email: "admin@savecollective.com",
  firstName: "Sarah",
  lastName: "Okonkwo",
  role: "admin",
  phone: "+234 800 123 4567",
  createdAt: "2024-01-10",
};

export const memberUser: User = {
  id: "u2",
  email: "james@email.com",
  firstName: "James",
  lastName: "Adeyemi",
  role: "member",
  phone: "+234 801 234 5678",
  createdAt: "2024-02-15",
};

export const members: Member[] = [
  { id: "m1", userId: "u2", firstName: "James", lastName: "Adeyemi", email: "james@email.com", phone: "+234 801 234 5678", joinDate: "2024-02-15", agreedContributionAmount: 50000, totalPaid: 50000, balanceRemaining: 0, status: "paid" },
  { id: "m2", userId: "u3", firstName: "Amina", lastName: "Bello", email: "amina@email.com", phone: "+234 802 345 6789", joinDate: "2024-02-20", agreedContributionAmount: 50000, totalPaid: 35000, balanceRemaining: 15000, status: "partial" },
  { id: "m3", userId: "u4", firstName: "Chidi", lastName: "Eze", email: "chidi@email.com", phone: "+234 803 456 7890", joinDate: "2024-03-01", agreedContributionAmount: 50000, totalPaid: 50000, balanceRemaining: 0, status: "paid" },
  { id: "m4", userId: "u5", firstName: "Fatima", lastName: "Musa", email: "fatima@email.com", phone: "+234 804 567 8901", joinDate: "2024-03-05", agreedContributionAmount: 50000, totalPaid: 0, balanceRemaining: 50000, status: "overdue" },
  { id: "m5", userId: "u6", firstName: "David", lastName: "Obi", email: "david@email.com", phone: "+234 805 678 9012", joinDate: "2024-03-10", agreedContributionAmount: 50000, totalPaid: 25000, balanceRemaining: 25000, status: "pending" },
  { id: "m6", userId: "u7", firstName: "Grace", lastName: "Nwosu", email: "grace@email.com", phone: "+234 806 789 0123", joinDate: "2024-03-15", agreedContributionAmount: 50000, totalPaid: 50000, balanceRemaining: 0, status: "paid" },
  { id: "m7", userId: "u8", firstName: "Ibrahim", lastName: "Yusuf", email: "ibrahim@email.com", phone: "+234 807 890 1234", joinDate: "2024-04-01", agreedContributionAmount: 50000, totalPaid: 10000, balanceRemaining: 40000, status: "partial" },
  { id: "m8", userId: "u9", firstName: "Kemi", lastName: "Afolabi", email: "kemi@email.com", phone: "+234 808 901 2345", joinDate: "2024-04-10", agreedContributionAmount: 50000, totalPaid: 50000, balanceRemaining: 0, status: "paid" },
];

export const contributionPlans: ContributionPlan[] = [
  { id: "cp1", amount: 50000, currency: "RWF", frequency: "monthly", effectiveDate: "2024-06-01", isActive: true, createdBy: "Sarah Okonkwo", createdAt: "2024-05-28", notes: "Increased from RWF 40,000" },
  { id: "cp2", amount: 40000, currency: "RWF", frequency: "monthly", effectiveDate: "2024-03-01", endDate: "2024-05-31", isActive: false, createdBy: "Sarah Okonkwo", createdAt: "2024-02-25", notes: "Initial amount" },
  { id: "cp3", amount: 30000, currency: "RWF", frequency: "monthly", effectiveDate: "2024-01-01", endDate: "2024-02-28", isActive: false, createdBy: "Sarah Okonkwo", createdAt: "2024-01-01" },
];

export const transactions: Transaction[] = [
  { id: "TXN-001", memberId: "m1", memberName: "James Adeyemi", amount: 25000, currency: "RWF", date: "2024-06-15", paymentMethod: "bank_transfer", enteredBy: "Sarah Okonkwo", status: "completed", reference: "BT-2024-001" },
  { id: "TXN-002", memberId: "m1", memberName: "James Adeyemi", amount: 25000, currency: "RWF", date: "2024-06-28", paymentMethod: "bank_transfer", enteredBy: "Sarah Okonkwo", status: "completed", reference: "BT-2024-002" },
  { id: "TXN-003", memberId: "m2", memberName: "Amina Bello", amount: 20000, currency: "RWF", date: "2024-06-10", paymentMethod: "cash", enteredBy: "Sarah Okonkwo", status: "completed", notes: "Paid in cash at meeting" },
  { id: "TXN-004", memberId: "m2", memberName: "Amina Bello", amount: 15000, currency: "RWF", date: "2024-06-25", paymentMethod: "mobile_money", enteredBy: "Sarah Okonkwo", status: "completed" },
  { id: "TXN-005", memberId: "m3", memberName: "Chidi Eze", amount: 50000, currency: "RWF", date: "2024-06-05", paymentMethod: "bank_transfer", enteredBy: "Sarah Okonkwo", status: "completed", reference: "BT-2024-005" },
  { id: "TXN-006", memberId: "m5", memberName: "David Obi", amount: 25000, currency: "RWF", date: "2024-06-20", paymentMethod: "cash", enteredBy: "Sarah Okonkwo", status: "completed" },
  { id: "TXN-007", memberId: "m6", memberName: "Grace Nwosu", amount: 50000, currency: "RWF", date: "2024-06-02", paymentMethod: "bank_transfer", enteredBy: "Sarah Okonkwo", status: "completed", reference: "BT-2024-007" },
  { id: "TXN-008", memberId: "m7", memberName: "Ibrahim Yusuf", amount: 10000, currency: "RWF", date: "2024-06-18", paymentMethod: "mobile_money", enteredBy: "Sarah Okonkwo", status: "completed" },
  { id: "TXN-009", memberId: "m8", memberName: "Kemi Afolabi", amount: 50000, currency: "RWF", date: "2024-06-01", paymentMethod: "bank_transfer", enteredBy: "Sarah Okonkwo", status: "completed", reference: "BT-2024-009" },
  { id: "TXN-010", memberId: "m5", memberName: "David Obi", amount: 10000, currency: "RWF", date: "2024-07-01", paymentMethod: "cash", enteredBy: "Sarah Okonkwo", status: "pending", notes: "Awaiting confirmation" },
];

export const notifications: Notification[] = [
  { id: "n1", userId: "u2", title: "Payment Received", message: "Your payment of ₦25,000 has been recorded.", type: "success", read: false, createdAt: "2024-06-28T10:00:00Z" },
  { id: "n2", userId: "u2", title: "Contribution Reminder", message: "Your next contribution is due on July 1st.", type: "info", read: false, createdAt: "2024-06-27T08:00:00Z" },
  { id: "n3", userId: "u2", title: "Amount Updated", message: "The collective contribution amount has been updated to ₦50,000.", type: "warning", read: true, createdAt: "2024-05-28T14:00:00Z" },
  { id: "n4", userId: "u2", title: "Welcome!", message: "Welcome to SaveCollective. Your account has been set up.", type: "info", read: true, createdAt: "2024-02-15T09:00:00Z" },
];

export const adminDashboardSummary: DashboardSummary = {
  totalMembers: 8,
  totalExpectedContributions: 400000,
  totalCollected: 270000,
  outstandingBalance: 130000,
  fullyPaidCount: 4,
  pendingCount: 2,
  overdueCount: 1,
  currency: "RWF",
};

export const memberDashboardSummary: MemberDashboardSummary = {
  agreedAmount: 50000,
  totalPaid: 50000,
  remainingBalance: 0,
  paymentStatus: "paid",
  currency: "RWF",
  nextDueDate: "2024-07-01",
};

export const formatCurrency = (amount: number, currency = "RWF") => {
  return new Intl.NumberFormat("en-RW", { style: "currency", currency }).format(amount);
};
