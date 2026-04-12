import { Wallet, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { getMemberByUserId, getTransactionsByMember, getNotifications, formatCurrency, getCurrentCycleDates, MONTHLY_CONTRIBUTION, CYCLE_MONTHS } from "@/services/api";

export default function MemberDashboard() {
  const { user, memberId } = useAuth();

  const { data: member } = useQuery({
    queryKey: ["myMember", user?.id],
    queryFn: () => getMemberByUserId(user!.id),
    enabled: !!user,
  });

  const { data: myTxns = [] } = useQuery({
    queryKey: ["myTransactions", memberId],
    queryFn: () => getTransactionsByMember(memberId!),
    enabled: !!memberId,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => getNotifications(user!.id),
    enabled: !!user,
  });

  const { cycleStart, cycleEnd, monthsElapsed } = getCurrentCycleDates();
  const annualTarget = MONTHLY_CONTRIBUTION * CYCLE_MONTHS;
  const expectedSoFar = MONTHLY_CONTRIBUTION * monthsElapsed;

  const cycleTxns = myTxns.filter(
    (t) => t.status === "completed" && t.date >= cycleStart && t.date <= cycleEnd
  );
  const totalPaid = cycleTxns.reduce((sum, t) => sum + Number(t.amount), 0);
  const remaining = Math.max(0, annualTarget - totalPaid);
  const progressPct = annualTarget > 0 ? Math.min(100, Math.round((totalPaid / annualTarget) * 100)) : 0;
  const status = totalPaid >= expectedSoFar ? "paid" : totalPaid > 0 ? "partial" : "pending";

  const recentTxns = myTxns.slice(0, 5);
  const unreadNotifs = notifications.filter((n) => !n.read);

  const txnCols: Column<any>[] = [
    { key: "id", header: "ID", className: "font-mono text-xs", render: (t) => t.id.slice(0, 8) },
    { key: "amount", header: "Amount", render: (t) => formatCurrency(Number(t.amount)) },
    { key: "date", header: "Date" },
    { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status} /> },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="My Dashboard" description="Track your savings progress" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="animate-fade-in-up stagger-1">
          <StatCard title="Monthly Target" value={formatCurrency(MONTHLY_CONTRIBUTION)} icon={Wallet} subtitle={`Month ${monthsElapsed} of ${CYCLE_MONTHS}`} />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <StatCard title="Total Paid (Cycle)" value={formatCurrency(totalPaid)} icon={CheckCircle} trend={annualTarget > 0 ? { value: `${progressPct}% of annual`, positive: true } : undefined} />
        </div>
        <div className="animate-fade-in-up stagger-3">
          <StatCard title="Remaining" value={formatCurrency(remaining)} icon={Clock} />
        </div>
        <div className="animate-fade-in-up stagger-4">
          <StatCard title="Status" value={status.charAt(0).toUpperCase() + status.slice(1)} icon={TrendingUp} />
        </div>
      </div>

      <div className="stat-card mb-8 space-y-4 animate-fade-in-up stagger-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold font-display">Contribution Progress</span>
          <span className="text-sm font-bold gradient-text">{progressPct}%</span>
        </div>
        <Progress value={progressPct} className="h-3 rounded-full" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatCurrency(totalPaid)} paid</span>
          <span>{formatCurrency(annualTarget)} annual target</span>
        </div>
      </div>

      {unreadNotifs.length > 0 && (
        <div className="mb-8 animate-fade-in-up stagger-4">
          <h2 className="text-lg font-semibold font-display mb-3">Notifications</h2>
          <div className="space-y-2">
            {unreadNotifs.map((n) => (
              <div key={n.id} className="stat-card flex items-start gap-3 !p-4">
                <div className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ring-4 ${
                  n.type === "success" ? "bg-success ring-success/20" :
                  n.type === "warning" ? "bg-warning ring-warning/20" :
                  "bg-info ring-info/20"
                }`} />
                <div>
                  <p className="text-sm font-semibold">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="animate-fade-in-up stagger-5">
        <h2 className="text-lg font-semibold font-display mb-3">Recent Transactions</h2>
        <div className="stat-card !p-0 overflow-hidden">
          <DataTable columns={txnCols} data={recentTxns} emptyMessage="No transactions yet" />
        </div>
      </div>
    </div>
  );
}
