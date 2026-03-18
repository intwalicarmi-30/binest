import { Users, Wallet, AlertTriangle, TrendingUp, PlusCircle, Edit, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { adminDashboardSummary, transactions, formatCurrency } from "@/data/mockData";
import type { Transaction } from "@/types";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const summary = adminDashboardSummary;
  const recentTxns = transactions.slice(0, 5);

  const txnColumns: Column<Transaction>[] = [
    { key: "id", header: "ID", className: "font-mono text-xs" },
    { key: "memberName", header: "Member" },
    { key: "amount", header: "Amount", render: (t) => formatCurrency(t.amount) },
    { key: "date", header: "Date" },
    { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Overview of your collective savings"
        actions={
          <div className="flex gap-2">
            <Button size="sm" onClick={() => navigate("/admin/add-payment")} className="gap-1.5">
              <PlusCircle className="h-4 w-4" /> Add Payment
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Total Members" value={String(summary.totalMembers)} icon={Users} />
        <StatCard title="Expected Total" value={formatCurrency(summary.totalExpectedContributions)} icon={Wallet} />
        <StatCard title="Total Collected" value={formatCurrency(summary.totalCollected)} icon={TrendingUp} subtitle={`${Math.round((summary.totalCollected / summary.totalExpectedContributions) * 100)}% collected`} />
        <StatCard title="Outstanding" value={formatCurrency(summary.outstandingBalance)} icon={AlertTriangle} />
      </div>

      {/* Status overview */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="stat-card flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
            <span className="text-lg font-bold text-success">{summary.fullyPaidCount}</span>
          </div>
          <div>
            <p className="text-sm font-medium">Fully Paid</p>
            <p className="text-xs text-muted-foreground">Members up to date</p>
          </div>
        </div>
        <div className="stat-card flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
            <span className="text-lg font-bold text-warning">{summary.pendingCount}</span>
          </div>
          <div>
            <p className="text-sm font-medium">Pending</p>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </div>
        </div>
        <div className="stat-card flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
            <span className="text-lg font-bold text-destructive">{summary.overdueCount}</span>
          </div>
          <div>
            <p className="text-sm font-medium">Overdue</p>
            <p className="text-xs text-muted-foreground">Needs follow-up</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate("/admin/add-payment")}>
          <PlusCircle className="h-5 w-5 text-primary" />
          <span className="text-sm">Record Payment</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate("/admin/contributions")}>
          <Edit className="h-5 w-5 text-primary" />
          <span className="text-sm">Edit Contribution Amount</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate("/admin/members")}>
          <Eye className="h-5 w-5 text-primary" />
          <span className="text-sm">View Members</span>
        </Button>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/transactions")}>View all</Button>
        </div>
        <DataTable columns={txnColumns} data={recentTxns} onRowClick={() => {}} />
      </div>
    </div>
  );
}
