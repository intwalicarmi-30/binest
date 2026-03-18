import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { contributionPlans, formatCurrency } from "@/data/mockData";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

export default function AdminContributions() {
  const [showModal, setShowModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const activePlan = contributionPlans.find((p) => p.isActive);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => { setShowModal(false); setConfirmed(false); }, 1500);
  };

  return (
    <div>
      <PageHeader
        title="Contribution Amount"
        description="Manage the agreed collective contribution"
        actions={<Button size="sm" onClick={() => setShowModal(true)}>Update Amount</Button>}
      />

      {/* Current active */}
      {activePlan && (
        <div className="stat-card mb-8 max-w-lg">
          <p className="text-sm text-muted-foreground mb-1">Current Active Amount</p>
          <p className="text-3xl font-bold text-primary">{formatCurrency(activePlan.amount)}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>Frequency: <span className="capitalize font-medium text-foreground">{activePlan.frequency}</span></span>
            <span>Since: <span className="font-medium text-foreground">{activePlan.effectiveDate}</span></span>
            <span>Set by: <span className="font-medium text-foreground">{activePlan.createdBy}</span></span>
          </div>
        </div>
      )}

      {/* History */}
      <h2 className="text-lg font-semibold mb-4">Amount History</h2>
      <div className="space-y-3 max-w-lg">
        {contributionPlans.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border bg-card p-4">
            <div>
              <p className="font-semibold">{formatCurrency(p.amount)}</p>
              <p className="text-xs text-muted-foreground">
                {p.effectiveDate} {p.endDate ? `– ${p.endDate}` : "– present"}
              </p>
              {p.notes && <p className="text-xs text-muted-foreground mt-1">{p.notes}</p>}
            </div>
            <StatusBadge status={p.isActive ? "paid" : "pending"} />
          </div>
        ))}
      </div>

      {/* Update modal */}
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
                <Input type="number" placeholder="50000" defaultValue="50000" />
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select defaultValue="monthly">
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
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Textarea placeholder="Reason for change..." />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={handleConfirm}>Confirm Update</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
