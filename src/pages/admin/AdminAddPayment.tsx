import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getMembers, createTransaction } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminAddPayment() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [method, setMethod] = useState<string>("bank_transfer");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
  });
  const hasMembers = members.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasMembers) {
      toast.error("Add at least one member before recording a payment");
      return;
    }
    if (!memberId || !amount || !date) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      await createTransaction({
        member_id: memberId,
        amount: Number(amount),
        date,
        payment_method: method as any,
        status: "completed",
        entered_by: user?.id ?? "",
        reference: reference || undefined,
        notes: notes || undefined,
      });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["membersWithBalances"] });
      setSubmitted(true);
      toast.success("Payment recorded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to record payment");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setMemberId("");
    setAmount("");
    setDate("");
    setMethod("bank_transfer");
    setReference("");
    setNotes("");
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-6">
        <CheckCircle className="h-16 w-16 text-success mx-auto" />
        <h2 className="text-2xl font-bold">Payment Recorded</h2>
        <p className="text-muted-foreground">The contribution has been recorded successfully.</p>
        <div className="flex justify-center gap-3">
          <Button onClick={resetForm}>Record Another</Button>
          <Button variant="outline" onClick={() => navigate("/admin/transactions")}>View Transactions</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <PageHeader title="Record Payment" description="Manually enter a member's contribution" />

      {!hasMembers && (
        <div className="mb-5 rounded-lg border bg-muted/40 p-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            No members found yet. Add at least one member before recording a payment.
          </p>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/members")}>
            Go to Members
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label>Member</Label>
          <Select value={memberId} onValueChange={setMemberId} required disabled={!hasMembers}>
            <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
            <SelectContent>
              {hasMembers ? (
                members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.first_name} {m.last_name}</SelectItem>
                ))
              ) : (
                <SelectItem value="no-members" disabled>No members available</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Amount (RWF)</Label>
          <Input type="number" placeholder="25000" required value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Payment Date</Label>
          <Input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Select value={method} onValueChange={setMethod}>
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
          <Input placeholder="e.g. BT-2024-001" value={reference} onChange={(e) => setReference(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Notes (optional)</Label>
          <Textarea placeholder="Additional notes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading || !hasMembers}>{loading ? "Saving..." : hasMembers ? "Record Payment" : "Add members first"}</Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
