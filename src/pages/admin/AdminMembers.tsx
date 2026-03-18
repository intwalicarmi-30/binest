import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMembersWithBalances, formatCurrency } from "@/services/api";
import { Search, UserPlus } from "lucide-react";

interface MemberRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  agreed_contribution_amount: number;
  totalPaid: number;
  balanceRemaining: number;
  computedStatus: string;
}

export default function AdminMembers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["membersWithBalances"],
    queryFn: getMembersWithBalances,
  });

  const filtered = members.filter(
    (m) =>
      `${m.first_name} ${m.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<MemberRow>[] = [
    {
      key: "name",
      header: "Name",
      render: (m) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {m.first_name[0]}{m.last_name[0]}
          </div>
          <div>
            <p className="font-medium text-sm">{m.first_name} {m.last_name}</p>
            <p className="text-xs text-muted-foreground">{m.email}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "Phone", render: (m) => m.phone || "—" },
    { key: "agreed_contribution_amount", header: "Agreed", render: (m) => formatCurrency(Number(m.agreed_contribution_amount)) },
    { key: "totalPaid", header: "Paid", render: (m) => formatCurrency(m.totalPaid) },
    { key: "balanceRemaining", header: "Balance", render: (m) => formatCurrency(m.balanceRemaining) },
    { key: "computedStatus", header: "Status", render: (m) => <StatusBadge status={m.computedStatus as any} /> },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Members" description="Manage all members in the collective" actions={<Button size="sm" className="gap-1.5"><UserPlus className="h-4 w-4" /> Add Member</Button>} />
      <div className="mb-6 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search members..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <DataTable columns={columns} data={filtered} onRowClick={(m) => navigate(`/admin/members/${m.id}`)} />
    </div>
  );
}
