import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { transactions, memberDashboardSummary, formatCurrency } from "@/data/mockData";
import type { Transaction } from "@/types";
import { Wallet, CheckCircle } from "lucide-react";

export default function MemberContributions() {
  const myTxns = transactions.filter((t) => t.memberId === "m1");
  const summary = memberDashboardSummary;

  const columns: Column<Transaction>[] = [
    { key: "id", header: "ID", className: "font-mono text-xs" },
    { key: "amount", header: "Amount", render: (t) => formatCurrency(t.amount) },
    { key: "date", header: "Date" },
    { key: "paymentMethod", header: "Method", render: (t) => <span className="capitalize">{t.paymentMethod.replace("_", " ")}</span> },
    { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status} /> },
  ];

  return (
    <div>
      <PageHeader title="My Contributions" description="View your contribution history" />
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <StatCard title="Total Contributed" value={formatCurrency(summary.totalPaid)} icon={CheckCircle} />
        <StatCard title="Agreed Amount" value={formatCurrency(summary.agreedAmount)} icon={Wallet} />
        <StatCard title="Remaining" value={formatCurrency(summary.remainingBalance)} />
      </div>
      <DataTable columns={columns} data={myTxns} emptyMessage="No contributions yet" />
    </div>
  );
}
