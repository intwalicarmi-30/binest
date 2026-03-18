import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { transactions, formatCurrency } from "@/data/mockData";
import type { Transaction } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function MemberTransactions() {
  const myTxns = transactions.filter((t) => t.memberId === "m1");
  const [selected, setSelected] = useState<Transaction | null>(null);

  const columns: Column<Transaction>[] = [
    { key: "id", header: "ID", className: "font-mono text-xs" },
    { key: "amount", header: "Amount", render: (t) => formatCurrency(t.amount) },
    { key: "date", header: "Date" },
    { key: "paymentMethod", header: "Method", render: (t) => <span className="capitalize">{t.paymentMethod.replace("_", " ")}</span> },
    { key: "enteredBy", header: "Recorded By" },
    { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Transaction History" description="All your recorded transactions" />
      <DataTable columns={columns} data={myTxns} onRowClick={setSelected} emptyMessage="No transactions yet" />

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Transaction Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              {[
                ["ID", selected.id],
                ["Amount", formatCurrency(selected.amount)],
                ["Date", selected.date],
                ["Method", selected.paymentMethod.replace("_", " ")],
                ["Recorded By", selected.enteredBy],
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
