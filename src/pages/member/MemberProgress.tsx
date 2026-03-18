import { PageHeader } from "@/components/shared/PageHeader";
import { Progress } from "@/components/ui/progress";
import { memberDashboardSummary, formatCurrency } from "@/data/mockData";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default function MemberProgress() {
  const summary = memberDashboardSummary;
  const pct = Math.round((summary.totalPaid / summary.agreedAmount) * 100);

  return (
    <div>
      <PageHeader title="Contribution Progress" description="Visual overview of your savings journey" />

      <div className="max-w-lg space-y-8">
        {/* Main progress */}
        <div className="stat-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Overall Progress</h2>
            <StatusBadge status={summary.paymentStatus} />
          </div>
          <div className="text-center py-6">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 52}`} strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct / 100)}`} className="transition-all duration-1000" />
              </svg>
              <span className="absolute text-2xl font-bold">{pct}%</span>
            </div>
          </div>
          <Progress value={pct} className="h-2" />
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{formatCurrency(summary.totalPaid)}</p>
              <p className="text-xs text-muted-foreground">Paid</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(summary.agreedAmount)}</p>
              <p className="text-xs text-muted-foreground">Target</p>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="stat-card">
          <h3 className="font-semibold mb-4">Milestones</h3>
          <div className="space-y-3">
            {[25, 50, 75, 100].map((m) => (
              <div key={m} className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${pct >= m ? "bg-success" : "bg-muted"}`} />
                <span className="text-sm flex-1">{m}% — {formatCurrency(summary.agreedAmount * m / 100)}</span>
                <span className="text-xs text-muted-foreground">{pct >= m ? "✓ Reached" : "Pending"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
