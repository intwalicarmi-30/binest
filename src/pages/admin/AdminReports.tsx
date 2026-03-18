import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { adminDashboardSummary, members, transactions, formatCurrency } from "@/data/mockData";
import { Users, Wallet, CheckCircle, Clock } from "lucide-react";

export default function AdminReports() {
  const summary = adminDashboardSummary;
  const totalManualEntries = transactions.length;
  const monthlyTotal = transactions.filter((t) => t.date.startsWith("2024-06")).reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      <PageHeader title="Reports & Insights" description="Summary of collective savings performance" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Total Members" value={String(summary.totalMembers)} icon={Users} />
        <StatCard title="Total Collected" value={formatCurrency(summary.totalCollected)} icon={Wallet} />
        <StatCard title="Fully Paid" value={String(summary.fullyPaidCount)} icon={CheckCircle} subtitle="Members" />
        <StatCard title="Manual Entries" value={String(totalManualEntries)} icon={Clock} />
      </div>

      {/* Member status breakdown */}
      <h2 className="text-lg font-semibold mb-4">Member Status Breakdown</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {(["paid", "partial", "pending", "overdue"] as const).map((status) => {
          const count = members.filter((m) => m.status === status).length;
          return (
            <div key={status} className="stat-card">
              <p className="text-sm font-medium capitalize text-muted-foreground">{status}</p>
              <p className="text-2xl font-bold">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Monthly summary */}
      <h2 className="text-lg font-semibold mb-4">Monthly Contribution Summary</h2>
      <div className="stat-card max-w-md mb-8">
        <p className="text-sm text-muted-foreground">June 2024</p>
        <p className="text-2xl font-bold">{formatCurrency(monthlyTotal)}</p>
        <p className="text-xs text-muted-foreground mt-1">{transactions.filter((t) => t.date.startsWith("2024-06")).length} transactions</p>
      </div>

      {/* Placeholder chart */}
      <h2 className="text-lg font-semibold mb-4">Collection Trends</h2>
      <div className="stat-card h-64 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm font-medium">Chart Coming Soon</p>
          <p className="text-xs">Contribution collection trends will be displayed here.</p>
        </div>
      </div>
    </div>
  );
}
