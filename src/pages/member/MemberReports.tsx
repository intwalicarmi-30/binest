import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { getAdminDashboardSummary, getMembersWithBalances, getTransactions, formatCurrency } from "@/services/api";
import { Users, Wallet, CheckCircle, Clock } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";

const chartConfig = {
  collected: { label: "Collected", color: "hsl(var(--primary))" },
  target: { label: "Target", color: "hsl(var(--muted-foreground))" },
  amount: { label: "Amount", color: "hsl(var(--primary))" },
};

export default function MemberReports() {
  const { data: summary } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: getAdminDashboardSummary,
  });

  const { data: members = [] } = useQuery({
    queryKey: ["membersWithBalances"],
    queryFn: getMembersWithBalances,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  const s = summary ?? { total_members: 0, total_expected: 0, total_collected: 0, outstanding: 0, fully_paid_count: 0, pending_count: 0, overdue_count: 0 };

  const statusData = [
    { name: "Paid", value: members.filter((m) => m.computedStatus === "paid").length, fill: "hsl(var(--success))" },
    { name: "Partial", value: members.filter((m) => m.computedStatus === "partial").length, fill: "hsl(var(--warning))" },
    { name: "Pending", value: members.filter((m) => m.computedStatus === "pending").length, fill: "hsl(var(--muted-foreground))" },
  ];

  return (
    <div>
      <PageHeader title="Reports & Insights" description="Summary of collective savings performance" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Total Members" value={String(s.total_members)} icon={Users} />
        <StatCard title="Total Collected" value={formatCurrency(Number(s.total_collected))} icon={Wallet} />
        <StatCard title="Fully Paid" value={String(s.fully_paid_count)} icon={CheckCircle} subtitle="Members" />
        <StatCard title="Transactions" value={String(transactions.length)} icon={Clock} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Member Status Breakdown</h2>
          <div className="stat-card">
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} animationDuration={800} label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Collection Summary</h2>
          <div className="stat-card space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Expected</span>
              <span className="font-semibold">{formatCurrency(Number(s.total_expected))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Collected</span>
              <span className="font-semibold text-success">{formatCurrency(Number(s.total_collected))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Outstanding</span>
              <span className="font-semibold text-destructive">{formatCurrency(Number(s.outstanding))}</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-3">
              <span className="text-muted-foreground">Collection Rate</span>
              <span className="font-semibold">{Number(s.total_expected) > 0 ? Math.round((Number(s.total_collected) / Number(s.total_expected)) * 100) : 0}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
