import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getMembersWithBalances, formatCurrency } from "@/services/api";
import { supabase } from "@/integrations/supabase/client";
import { Search, UserPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MemberRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    agreed_contribution_amount: "50000",
    password: "",
    role: "member" as "admin" | "member",
  });

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
    {
      key: "actions",
      header: "",
      render: (m) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            setDeleteTarget(m);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const handleDeleteMember = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { data, error } = await supabase.functions.invoke("delete-member", {
        body: { member_id: deleteTarget.id },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["membersWithBalances"] }),
        queryClient.invalidateQueries({ queryKey: ["members"] }),
        queryClient.invalidateQueries({ queryKey: ["adminDashboard"] }),
      ]);
      toast.success(`${deleteTarget.first_name} ${deleteTarget.last_name} has been removed`);
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete member");
    } finally {
      setDeleting(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim()) {
      toast.error("Please fill in first name, last name, and email");
      return;
    }

    const amount = Number(form.agreed_contribution_amount);
    if (Number.isNaN(amount) || amount < 0) {
      toast.error("Please enter a valid contribution amount");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-member", {
        body: {
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim() || undefined,
          agreed_contribution_amount: amount,
          role: form.role,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["membersWithBalances"] }),
        queryClient.invalidateQueries({ queryKey: ["members"] }),
        queryClient.invalidateQueries({ queryKey: ["adminDashboard"] }),
      ]);

      toast.success("Member added successfully");
      setAddOpen(false);
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        agreed_contribution_amount: "50000",
        password: "",
        role: "member",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to add member");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Members" description="Manage all members in the collective" actions={<Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}><UserPlus className="h-4 w-4" /> Add Member</Button>} />
      <div className="mb-6 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search members..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <DataTable columns={columns} data={filtered} onRowClick={(m) => navigate(`/admin/members/${m.id}`)} />

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete member?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong>{deleteTarget?.first_name} {deleteTarget?.last_name}</strong>, their account, and all their transactions. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMember}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete Member"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="first_name">First name</Label>
                <Input
                  id="first_name"
                  value={form.first_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, first_name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last name</Label>
                <Input
                  id="last_name"
                  value={form.last_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, last_name: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(val) => setForm((prev) => ({ ...prev, role: val as "admin" | "member" }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agreed_amount">Agreed contribution amount (RWF)</Label>
              <Input
                id="agreed_amount"
                type="number"
                min={0}
                value={form.agreed_contribution_amount}
                onChange={(e) => setForm((prev) => ({ ...prev, agreed_contribution_amount: e.target.value }))}
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Member"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
