/**
 * Placeholder API service layer.
 * Replace these functions with real API calls when connecting to your backend.
 */

import {
  adminDashboardSummary,
  memberDashboardSummary,
  members,
  transactions,
  contributionPlans,
  notifications,
} from "@/data/mockData";
import type {
  DashboardSummary,
  MemberDashboardSummary,
  Member,
  Transaction,
  ContributionPlan,
  Notification,
} from "@/types";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// Dashboard
export async function getAdminDashboardData(): Promise<DashboardSummary> {
  await delay();
  return adminDashboardSummary;
}

export async function getMemberDashboardData(): Promise<MemberDashboardSummary> {
  await delay();
  return memberDashboardSummary;
}

// Members
export async function getMembers(): Promise<Member[]> {
  await delay();
  return members;
}

export async function getMemberById(id: string): Promise<Member | undefined> {
  await delay();
  return members.find((m) => m.id === id);
}

// Transactions
export async function getTransactions(): Promise<Transaction[]> {
  await delay();
  return transactions;
}

export async function getTransactionsByMember(memberId: string): Promise<Transaction[]> {
  await delay();
  return transactions.filter((t) => t.memberId === memberId);
}

// Contribution Plans
export async function getContributionPlans(): Promise<ContributionPlan[]> {
  await delay();
  return contributionPlans;
}

export async function updateContributionAmount(
  _amount: number,
  _notes?: string
): Promise<ContributionPlan> {
  await delay(500);
  // In production, this would POST to your API
  return contributionPlans[0];
}

// Manual Contribution
export async function createManualContribution(
  _data: Partial<Transaction>
): Promise<Transaction> {
  await delay(500);
  // In production, this would POST to your API
  return transactions[0];
}

// Notifications
export async function getNotifications(): Promise<Notification[]> {
  await delay();
  return notifications;
}

// Auth (placeholders)
export async function login(_email: string, _password: string) {
  await delay(500);
  return { success: true };
}

export async function signup(_data: { email: string; password: string; firstName: string; lastName: string }) {
  await delay(500);
  return { success: true };
}

export async function resetPassword(_email: string) {
  await delay(500);
  return { success: true };
}
