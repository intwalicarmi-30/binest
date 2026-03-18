import { PaymentStatus, TransactionStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  paid: "bg-success/10 text-success border-success/20 shadow-sm shadow-success/5",
  completed: "bg-success/10 text-success border-success/20 shadow-sm shadow-success/5",
  pending: "bg-warning/10 text-warning border-warning/20 shadow-sm shadow-warning/5",
  partial: "bg-info/10 text-info border-info/20 shadow-sm shadow-info/5",
  overdue: "bg-destructive/10 text-destructive border-destructive/20 shadow-sm shadow-destructive/5",
  failed: "bg-destructive/10 text-destructive border-destructive/20 shadow-sm shadow-destructive/5",
  reversed: "bg-muted text-muted-foreground border-muted",
};

interface StatusBadgeProps {
  status: PaymentStatus | TransactionStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize font-semibold text-xs px-2.5 py-0.5 rounded-lg",
        statusStyles[status] || "",
        className
      )}
    >
      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </Badge>
  );
}
