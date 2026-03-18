import { Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface TopbarProps {
  role: "admin" | "member";
}

export function Topbar({ role }: TopbarProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 lg:px-8">
      <div className="lg:hidden w-10" /> {/* spacer for mobile menu button */}
      <div className="hidden lg:block">
        <p className="text-sm text-muted-foreground">
          {role === "admin" ? "Admin Panel" : "Member Portal"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => navigate(role === "admin" ? "/admin" : "/member/notifications")}
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            2
          </span>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
