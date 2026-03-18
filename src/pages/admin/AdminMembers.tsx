import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { members, formatCurrency } from "@/data/mockData";
import type { Member } from "@/types";
import { Search, UserPlus } from "lucide-react";

export default function AdminMembers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = members.filter(
    (m) =>
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Member>[] = [
    {
      key: "name",
      header: "Name",
      render: (m) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {m.firstName[0]}{m.lastName[0]}
          </div>
          <div>
            <p className="font-medium text-sm">{m.firstName} {m.lastName}</p>
            <p className="text-xs text-muted-foreground">{m.email}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "Phone" },
    { key: "agreedContributionAmount", header: "Agreed", render: (m) => formatCurrency(m.agreedContributionAmount) },
    { key: "totalPaid", header: "Paid", render: (m) => formatCurrency(m.totalPaid) },
    { key: "balanceRemaining", header: "Balance", render: (m) => formatCurrency(m.balanceRemaining) },
    { key: "status", header: "Status", render: (m) => <StatusBadge status={m.status} /> },
  ];

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
