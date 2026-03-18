import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getContributionPlans, createContributionPlan, formatCurrency } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminContributions() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newAmount, setNewAmount] = useState("50000");
  const [frequency, setFrequency] = useState<string>("monthly");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [notes, setNotes] = useState("");

  const { data: plans = [] } = useQuery({
    queryKey: ["contributionPlans"],
    queryFn: getContributionPlans,
  });

  const activePlan = plans.find((p) => p.is_active);

  const handleConfirm = async () => {
    if (!newAmount || !effectiveDate) {
      toast.error("Please fill in required fields");
      return;
    }
    setLoading(true);
    try {
      await createContributionPlan({
        amount: Number(newAmount),
        frequency: frequency as any,
        effective_date: effectiveDate,
        notes: notes || undefined,
        created_by: user?.id ?? "",
      });
      queryClient.invalidateQueries({ queryKey: ["contributionPlans"] });
      setConfirmed(true);
      toast.success("Contribution amount updated");
      setTimeout(() => { setShowModal(false); setConfirmed(false); }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Contribution Amount"
        description="Manage the agreed collective contribution"
        actions={<Button size="sm" onClick={() => setShowModal(true)}>Update Amount</Button>}
      />

      {activePlan && (
        <div className="stat-card mb-8 max-w-lg">
          <p className="text-sm text-muted-foreground mb-1">Current Active Amount</p>
          <p className="text-3xl font-bold text-primary">{formatCurrency(Number(activePlan.amount))}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>Frequency: <span className="capitalize font-medium text-foreground">{activePlan.frequency}</span></span>
            <span>Since: <span className="font-medium text-foreground">{activePlan.effective_date}</span></span>
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold mb-4">Amount History</h2>
      <div className="space-y-3 max-w-lg">
        {plans.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border bg-card p-4">
            <div>
              <p className="font-semibold">{formatCurrency(Number(p.amount))}</p>
              <p className="text-xs text-muted-foreground">
                {p.effective_date} {p.end_date ? `– ${p.end_date}` : "– present"}
              </p>
              {p.notes && <p className="text-xs text-muted-foreground mt-1">{p.notes}</p>}
            </div>
            <StatusBadge status={p.is_active ? "paid" : "pending"} />
          </div>
        ))}
        {plans.length === 0 && <p className="text-muted-foreground text-sm">No contribution plans yet.</p>}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>{confirmed ? "Updated!" : "Update Contribution Amount"}</DialogTitle></DialogHeader>
          {confirmed ? (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Contribution amount updated successfully.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>New Amount (RWF)</Label>
                <Input type="number" placeholder="50000" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Biweekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Effective Date</Label>
                <Input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Textarea placeholder="Reason for change..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={handleConfirm} disabled={loading}>{loading ? "Saving..." : "Confirm Update"}</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
