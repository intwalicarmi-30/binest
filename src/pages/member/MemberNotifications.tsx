import { PageHeader } from "@/components/shared/PageHeader";
import { notifications } from "@/data/mockData";
import { Bell } from "lucide-react";

export default function MemberNotifications() {
  return (
    <div>
      <PageHeader title="Notifications" description="Stay updated on your savings activity" />

      {notifications.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3 max-w-lg">
          {notifications.map((n) => (
            <div key={n.id} className={`stat-card flex items-start gap-3 !p-4 ${!n.read ? "ring-1 ring-primary/20" : ""}`}>
              <div className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${n.type === "success" ? "bg-success" : n.type === "warning" ? "bg-warning" : n.type === "error" ? "bg-destructive" : "bg-info"}`} />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{n.title}</p>
                  {!n.read && <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">New</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
