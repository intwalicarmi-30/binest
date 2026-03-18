import { PaymentStatus, TransactionStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  paid: "bg-success/10 text-success border-success/20",
  completed: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  partial: "bg-info/10 text-info border-info/20",
  overdue: "bg-destructive/10 text-destructive border-destructive/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
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
        "capitalize font-medium text-xs px-2.5 py-0.5",
        statusStyles[status] || "",
        className
      )}
    >
      {status}
    </Badge>
  );
}
