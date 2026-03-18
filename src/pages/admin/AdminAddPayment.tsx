import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { members } from "@/data/mockData";
import { CheckCircle } from "lucide-react";

export default function AdminAddPayment() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setSubmitted(true); setLoading(false); }, 800);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-6">
        <CheckCircle className="h-16 w-16 text-success mx-auto" />
        <h2 className="text-2xl font-bold">Payment Recorded</h2>
        <p className="text-muted-foreground">The contribution has been recorded successfully.</p>
        <div className="flex justify-center gap-3">
          <Button onClick={() => setSubmitted(false)}>Record Another</Button>
          <Button variant="outline" onClick={() => navigate("/admin/transactions")}>View Transactions</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <PageHeader title="Record Payment" description="Manually enter a member's contribution" />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label>Member</Label>
          <Select required>
            <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
            <SelectContent>
              {members.map((m) => (
                <SelectItem key={m.id} value={m.id}>{m.firstName} {m.lastName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Amount (NGN)</Label>
          <Input type="number" placeholder="25000" required />
        </div>
        <div className="space-y-2">
          <Label>Payment Date</Label>
          <Input type="date" required />
        </div>
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Select defaultValue="bank_transfer">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="mobile_money">Mobile Money</SelectItem>
              <SelectItem value="check">Check</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Reference (optional)</Label>
          <Input placeholder="e.g. BT-2024-001" />
        </div>
        <div className="space-y-2">
          <Label>Notes (optional)</Label>
          <Textarea placeholder="Additional notes..." />
        </div>

        <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-center text-xs text-muted-foreground">
          <p className="font-medium mb-1">Future Integration</p>
          <p>Automated payment gateway and mobile money integration coming soon.</p>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Record Payment"}</Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
