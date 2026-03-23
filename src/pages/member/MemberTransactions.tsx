import { useState, useMemo } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { getTransactionsByMember, formatCurrency } from "@/services/api";
import { CalendarIcon, X, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function exportToCsv(data: any[], filename: string) {
  if (!data.length) { toast.error("No data to export"); return; }
  const headers = ["ID", "Amount", "Date", "Method", "Status", "Reference", "Notes"];
  const rows = data.map(t => [
    t.id, t.amount, t.date, t.payment_method?.replace("_", " "),
    t.status, t.reference || "", t.notes || "",
  ]);
  const csv = [headers, ...rows].map(r => r.map((v: string) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  toast.success(`Exported ${data.length} transactions`);
}

export default function MemberTransactions() {
  const { memberId } = useAuth();
  const [selected, setSelected] = useState<any | null>(null);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const { data: allTxns = [] } = useQuery({
    queryKey: ["myTransactions", memberId],
    queryFn: () => getTransactionsByMember(memberId!),
    enabled: !!memberId,
  });

  const myTxns = useMemo(() => {
    return allTxns.filter((t) => {
      const txDate = new Date(t.date);
      const matchesFrom = !dateFrom || txDate >= dateFrom;
      const matchesTo = !dateTo || txDate <= dateTo;
      return matchesFrom && matchesTo;
    });
  }, [allTxns, dateFrom, dateTo]);

  const clearDates = () => { setDateFrom(undefined); setDateTo(undefined); };

  const columns: Column<any>[] = [
    { key: "id", header: "ID", className: "font-mono text-xs", render: (t) => t.id.slice(0, 8) },
    { key: "amount", header: "Amount", render: (t) => formatCurrency(Number(t.amount)) },
    { key: "date", header: "Date" },
    { key: "payment_method", header: "Method", render: (t) => <span className="capitalize">{t.payment_method.replace("_", " ")}</span> },
    { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Transaction History" description="All your recorded transactions" />

      <div className="flex flex-wrap gap-3 mb-6">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-[150px] justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFrom ? format(dateFrom, "MMM d, yyyy") : "From date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-[150px] justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateTo ? format(dateTo, "MMM d, yyyy") : "To date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>

        {(dateFrom || dateTo) && (
          <Button variant="ghost" size="sm" onClick={clearDates} className="gap-1 text-muted-foreground">
            <X className="h-4 w-4" /> Clear dates
          </Button>
        )}
      </div>

      <DataTable columns={columns} data={myTxns} onRowClick={setSelected} emptyMessage="No transactions yet" pageSize={8} />

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Transaction Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              {[
                ["ID", selected.id.slice(0, 8)],
                ["Amount", formatCurrency(Number(selected.amount))],
                ["Date", selected.date],
                ["Method", selected.payment_method.replace("_", " ")],
                ["Reference", selected.reference || "—"],
                ["Notes", selected.notes || "—"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{val}</span>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={selected.status} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
