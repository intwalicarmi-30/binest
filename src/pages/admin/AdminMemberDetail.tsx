import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { getMemberById, getTransactionsByMember, formatCurrency } from "@/services/api";
import { ArrowLeft, Mail, Phone, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AdminMemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: member, isLoading: memberLoading } = useQuery({
    queryKey: ["member", id],
    queryFn: () => getMemberById(id!),
    enabled: !!id,
  });

  const { data: memberTxns = [] } = useQuery({
    queryKey: ["memberTransactions", id],
    queryFn: () => getTransactionsByMember(id!),
    enabled: !!id,
  });

  if (memberLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Member not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/admin/members")}>Back to Members</Button>
      </div>
    );
  }

  const totalPaid = memberTxns
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const agreed = Number(member.agreed_contribution_amount);
  const remaining = Math.max(0, agreed - totalPaid);
  const progressPct = agreed > 0 ? Math.round((totalPaid / agreed) * 100) : 0;
  const computedStatus = totalPaid >= agreed ? "paid" : totalPaid > 0 ? "partial" : "pending";

  const txnCols: Column<any>[] = [
    { key: "id", header: "ID", className: "font-mono text-xs", render: (t) => t.id.slice(0, 8) },
    { key: "amount", header: "Amount", render: (t) => formatCurrency(Number(t.amount)) },
    { key: "date", header: "Date" },
    { key: "payment_method", header: "Method", render: (t) => <span className="capitalize">{t.payment_method.replace("_", " ")}</span> },
    { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status} /> },
  ];

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-4 gap-1.5" onClick={() => navigate("/admin/members")}>
        <ArrowLeft className="h-4 w-4" /> Back to Members
      </Button>

      <PageHeader
        title={`${member.first_name} ${member.last_name}`}
        actions={<StatusBadge status={computedStatus as any} />}
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="stat-card space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4" /> Email</div>
          <p className="font-medium text-sm">{member.email}</p>
        </div>
        <div className="stat-card space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" /> Phone</div>
          <p className="font-medium text-sm">{member.phone || "—"}</p>
        </div>
        <div className="stat-card space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4" /> Joined</div>
          <p className="font-medium text-sm">{member.join_date}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-4">
        <StatCard title="Agreed Amount" value={formatCurrency(agreed)} />
        <StatCard title="Total Paid" value={formatCurrency(totalPaid)} />
        <StatCard title="Remaining" value={formatCurrency(remaining)} />
      </div>

      <div className="stat-card mb-8 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Payment Progress</span>
          <span className="font-medium">{progressPct}%</span>
        </div>
        <Progress value={progressPct} className="h-2" />
      </div>

      <h2 className="text-lg font-semibold mb-4">Contribution History</h2>
      <DataTable columns={txnCols} data={memberTxns} emptyMessage="No transactions yet" />
    </div>
  );
}
