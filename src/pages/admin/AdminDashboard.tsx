import { Users, Wallet, AlertTriangle, TrendingUp, PlusCircle, Edit, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { getAdminDashboardSummary, getTransactions, formatCurrency } from "@/services/api";

interface TransactionRow {
  id: string;
  memberName: string;
  amount: number;
  date: string;
  status: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: getAdminDashboardSummary,
  });

  const { data: allTxns } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  const recentTxns = (allTxns ?? []).slice(0, 5);

  const txnColumns: Column<TransactionRow>[] = [
    { key: "id", header: "ID", className: "font-mono text-xs", render: (t) => t.id.slice(0, 8) },
    { key: "memberName", header: "Member" },
    { key: "amount", header: "Amount", render: (t) => formatCurrency(t.amount) },
    { key: "date", header: "Date" },
    { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status as any} /> },
  ];

  if (summaryLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const s = summary ?? { total_members: 0, total_expected: 0, total_collected: 0, outstanding: 0, fully_paid_count: 0, pending_count: 0, overdue_count: 0 };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Admin Dashboard"
        description="Overview of your collective savings"
        actions={
          <Button size="sm" onClick={() => navigate("/admin/add-payment")} className="gap-1.5 gradient-bg border-0 shadow-lg glow rounded-xl">
            <PlusCircle className="h-4 w-4" /> Add Payment
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="animate-fade-in-up stagger-1">
          <StatCard title="Total Members" value={String(s.total_members)} icon={Users} />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <StatCard title="Expected Total" value={formatCurrency(Number(s.total_expected))} icon={Wallet} />
        </div>
        <div className="animate-fade-in-up stagger-3">
          <StatCard title="Total Collected" value={formatCurrency(Number(s.total_collected))} icon={TrendingUp} subtitle={s.total_expected > 0 ? `${Math.round((Number(s.total_collected) / Number(s.total_expected)) * 100)}% collected` : undefined} />
        </div>
        <div className="animate-fade-in-up stagger-4">
          <StatCard title="Outstanding" value={formatCurrency(Number(s.outstanding))} icon={AlertTriangle} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {[
          { label: "Fully Paid", count: s.fully_paid_count, sub: "Members up to date", colorClass: "bg-success/10 text-success" },
          { label: "Pending", count: s.pending_count, sub: "Awaiting payment", colorClass: "bg-warning/10 text-warning" },
          { label: "Overdue", count: s.overdue_count, sub: "Needs follow-up", colorClass: "bg-destructive/10 text-destructive" },
        ].map((item, i) => (
          <div key={item.label} className={`stat-card flex items-center gap-4 animate-fade-in-up stagger-${i + 2}`}>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.colorClass}`}>
              <span className="text-lg font-bold font-display">{item.count}</span>
            </div>
            <div>
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {[
          { icon: PlusCircle, label: "Record Payment", path: "/admin/add-payment" },
          { icon: Edit, label: "Edit Contribution", path: "/admin/contributions" },
          { icon: Eye, label: "View Members", path: "/admin/members" },
        ].map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="h-auto py-5 flex-col gap-3 rounded-2xl border-dashed border-2 hover:border-primary/30 hover:bg-accent/50 transition-all duration-300"
            onClick={() => navigate(action.path)}
          >
            <div className="rounded-xl gradient-bg p-2.5 shadow-lg glow">
              <action.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium">{action.label}</span>
          </Button>
        ))}
      </div>

      <div className="animate-fade-in-up stagger-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold font-display">Recent Transactions</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/transactions")} className="text-primary hover:text-primary/80">
            View all →
          </Button>
        </div>
        <div className="stat-card !p-0 overflow-hidden">
          <DataTable columns={txnColumns} data={recentTxns} onRowClick={() => {}} />
        </div>
      </div>
    </div>
  );
}
