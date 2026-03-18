import { Wallet, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Progress } from "@/components/ui/progress";
import { memberDashboardSummary, transactions, notifications, formatCurrency } from "@/data/mockData";
import type { Transaction } from "@/types";

export default function MemberDashboard() {
  const summary = memberDashboardSummary;
  const myTxns = transactions.filter((t) => t.memberId === "m1").slice(0, 5);
  const unreadNotifs = notifications.filter((n) => !n.read);
  const progressPct = Math.round((summary.totalPaid / summary.agreedAmount) * 100);

  const txnCols: Column<Transaction>[] = [
    { key: "id", header: "ID", className: "font-mono text-xs" },
    { key: "amount", header: "Amount", render: (t) => formatCurrency(t.amount) },
    { key: "date", header: "Date" },
    { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status} /> },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="My Dashboard" description="Track your savings progress" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="animate-fade-in-up stagger-1">
          <StatCard title="Agreed Amount" value={formatCurrency(summary.agreedAmount)} icon={Wallet} />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <StatCard title="Total Paid" value={formatCurrency(summary.totalPaid)} icon={CheckCircle} trend={{ value: "100% complete", positive: true }} />
        </div>
        <div className="animate-fade-in-up stagger-3">
          <StatCard title="Remaining" value={formatCurrency(summary.remainingBalance)} icon={Clock} />
        </div>
        <div className="animate-fade-in-up stagger-4">
          <StatCard title="Status" value={summary.paymentStatus.charAt(0).toUpperCase() + summary.paymentStatus.slice(1)} icon={TrendingUp} />
        </div>
      </div>

      {/* Progress */}
      <div className="stat-card mb-8 space-y-4 animate-fade-in-up stagger-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold font-display">Contribution Progress</span>
          <span className="text-sm font-bold gradient-text">{progressPct}%</span>
        </div>
        <div className="relative">
          <Progress value={progressPct} className="h-3 rounded-full" />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatCurrency(summary.totalPaid)} paid</span>
          <span>{formatCurrency(summary.agreedAmount)} target</span>
        </div>
      </div>

      {/* Notifications */}
      {unreadNotifs.length > 0 && (
        <div className="mb-8 animate-fade-in-up stagger-4">
          <h2 className="text-lg font-semibold font-display mb-3">Notifications</h2>
          <div className="space-y-2">
            {unreadNotifs.map((n) => (
              <div key={n.id} className="stat-card flex items-start gap-3 !p-4">
                <div className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ring-4 ${
                  n.type === "success" ? "bg-success ring-success/20" :
                  n.type === "warning" ? "bg-warning ring-warning/20" :
                  "bg-info ring-info/20"
                }`} />
                <div>
                  <p className="text-sm font-semibold">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent transactions */}
      <div className="animate-fade-in-up stagger-5">
        <h2 className="text-lg font-semibold font-display mb-3">Recent Transactions</h2>
        <div className="stat-card !p-0 overflow-hidden">
          <DataTable columns={txnCols} data={myTxns} emptyMessage="No transactions yet" />
        </div>
      </div>
    </div>
  );
}
