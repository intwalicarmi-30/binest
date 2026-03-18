import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { getMemberByUserId, getTransactionsByMember, formatCurrency } from "@/services/api";
import { Wallet, CheckCircle } from "lucide-react";

export default function MemberContributions() {
  const { user, memberId } = useAuth();

  const { data: member } = useQuery({
    queryKey: ["myMember", user?.id],
    queryFn: () => getMemberByUserId(user!.id),
    enabled: !!user,
  });

  const { data: myTxns = [] } = useQuery({
    queryKey: ["myTransactions", memberId],
    queryFn: () => getTransactionsByMember(memberId!),
    enabled: !!memberId,
  });

  const totalPaid = myTxns
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const agreed = Number(member?.agreed_contribution_amount ?? 0);
  const remaining = Math.max(0, agreed - totalPaid);

  const columns: Column<any>[] = [
    { key: "id", header: "ID", className: "font-mono text-xs", render: (t) => t.id.slice(0, 8) },
    { key: "amount", header: "Amount", render: (t) => formatCurrency(Number(t.amount)) },
    { key: "date", header: "Date" },
    { key: "payment_method", header: "Method", render: (t) => <span className="capitalize">{t.payment_method.replace("_", " ")}</span> },
    { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status} /> },
  ];

  return (
    <div>
      <PageHeader title="My Contributions" description="View your contribution history" />
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <StatCard title="Total Contributed" value={formatCurrency(totalPaid)} icon={CheckCircle} />
        <StatCard title="Agreed Amount" value={formatCurrency(agreed)} icon={Wallet} />
        <StatCard title="Remaining" value={formatCurrency(remaining)} />
      </div>
      <DataTable columns={columns} data={myTxns} emptyMessage="No contributions yet" />
    </div>
  );
}
