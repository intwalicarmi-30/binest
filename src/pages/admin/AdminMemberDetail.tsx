import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { members, transactions, formatCurrency } from "@/data/mockData";
import type { Transaction } from "@/types";
import { ArrowLeft, Mail, Phone, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AdminMemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const member = members.find((m) => m.id === id);

  if (!member) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Member not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/admin/members")}>Back to Members</Button>
      </div>
    );
  }

  const memberTxns = transactions.filter((t) => t.memberId === member.id);
  const progressPct = Math.round((member.totalPaid / member.agreedContributionAmount) * 100);

  const txnCols: Column<Transaction>[] = [
    { key: "id", header: "ID", className: "font-mono text-xs" },
    { key: "amount", header: "Amount", render: (t) => formatCurrency(t.amount) },
    { key: "date", header: "Date" },
    { key: "paymentMethod", header: "Method", render: (t) => t.paymentMethod.replace("_", " ") },
    { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status} /> },
  ];

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-4 gap-1.5" onClick={() => navigate("/admin/members")}>
        <ArrowLeft className="h-4 w-4" /> Back to Members
      </Button>

      <PageHeader
        title={`${member.firstName} ${member.lastName}`}
        actions={<StatusBadge status={member.status} />}
      />

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="stat-card space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4" /> Email</div>
          <p className="font-medium text-sm">{member.email}</p>
        </div>
        <div className="stat-card space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" /> Phone</div>
          <p className="font-medium text-sm">{member.phone}</p>
        </div>
        <div className="stat-card space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4" /> Joined</div>
          <p className="font-medium text-sm">{member.joinDate}</p>
        </div>
      </div>

      {/* Financial summary */}
      <div className="grid gap-4 sm:grid-cols-3 mb-4">
        <StatCard title="Agreed Amount" value={formatCurrency(member.agreedContributionAmount)} />
        <StatCard title="Total Paid" value={formatCurrency(member.totalPaid)} />
        <StatCard title="Remaining" value={formatCurrency(member.balanceRemaining)} />
      </div>

      <div className="stat-card mb-8 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Payment Progress</span>
          <span className="font-medium">{progressPct}%</span>
        </div>
        <Progress value={progressPct} className="h-2" />
      </div>

      {/* Transaction history */}
      <h2 className="text-lg font-semibold mb-4">Contribution History</h2>
      <DataTable columns={txnCols} data={memberTxns} emptyMessage="No transactions yet" />
    </div>
  );
}
