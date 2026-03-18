import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { adminDashboardSummary, members, transactions, formatCurrency } from "@/data/mockData";
import { Users, Wallet, CheckCircle, Clock } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";

const monthlyData = [
  { month: "Jan", collected: 30000, target: 50000 },
  { month: "Feb", collected: 45000, target: 50000 },
  { month: "Mar", collected: 120000, target: 150000 },
  { month: "Apr", collected: 60000, target: 100000 },
  { month: "May", collected: 90000, target: 100000 },
  { month: "Jun", collected: 270000, target: 400000 },
];

const statusData = [
  { name: "Paid", value: members.filter((m) => m.status === "paid").length, fill: "hsl(var(--success))" },
  { name: "Partial", value: members.filter((m) => m.status === "partial").length, fill: "hsl(var(--warning))" },
  { name: "Pending", value: members.filter((m) => m.status === "pending").length, fill: "hsl(var(--muted-foreground))" },
  { name: "Overdue", value: members.filter((m) => m.status === "overdue").length, fill: "hsl(var(--destructive))" },
];

const weeklyTrend = [
  { week: "W1", amount: 100000 },
  { week: "W2", amount: 60000 },
  { week: "W3", amount: 35000 },
  { week: "W4", amount: 75000 },
];

const chartConfig = {
  collected: { label: "Collected", color: "hsl(var(--primary))" },
  target: { label: "Target", color: "hsl(var(--muted-foreground))" },
  amount: { label: "Amount", color: "hsl(var(--primary))" },
};

export default function AdminReports() {
  const summary = adminDashboardSummary;
  const totalManualEntries = transactions.length;

  return (
    <div>
      <PageHeader title="Reports & Insights" description="Summary of collective savings performance" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Total Members" value={String(summary.totalMembers)} icon={Users} />
        <StatCard title="Total Collected" value={formatCurrency(summary.totalCollected)} icon={Wallet} />
        <StatCard title="Fully Paid" value={String(summary.fullyPaidCount)} icon={CheckCircle} subtitle="Members" />
        <StatCard title="Manual Entries" value={String(totalManualEntries)} icon={Clock} />
      </div>

      {/* Collection Trends Bar Chart */}
      <h2 className="text-lg font-semibold mb-4">Collection Trends</h2>
      <div className="stat-card mb-8">
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <BarChart data={monthlyData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `₦${v / 1000}k`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="collected" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} animationDuration={800} />
            <Bar dataKey="target" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} animationDuration={800} />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Two-column: Pie + Area */}
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
          <h2 className="text-lg font-semibold mb-4">Weekly Collection Trend</h2>
          <div className="stat-card">
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <AreaChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `₦${v / 1000}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.15)" animationDuration={800} />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      </div>

      {/* Monthly summary */}
      <h2 className="text-lg font-semibold mb-4">Monthly Contribution Summary</h2>
      <div className="stat-card max-w-md mb-8">
        <p className="text-sm text-muted-foreground">June 2024</p>
        <p className="text-2xl font-bold">{formatCurrency(transactions.filter((t) => t.date.startsWith("2024-06")).reduce((s, t) => s + t.amount, 0))}</p>
        <p className="text-xs text-muted-foreground mt-1">{transactions.filter((t) => t.date.startsWith("2024-06")).length} transactions</p>
      </div>
    </div>
  );
}