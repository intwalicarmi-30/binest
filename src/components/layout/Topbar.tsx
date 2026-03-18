import { Bell, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";

interface TopbarProps {
  role: "admin" | "member";
}

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/members": "Members",
  "/admin/contributions": "Contributions",
  "/admin/add-payment": "Add Payment",
  "/admin/transactions": "Transactions",
  "/admin/reports": "Reports",
  "/admin/settings": "Settings",
  "/member": "Dashboard",
  "/member/contributions": "My Contributions",
  "/member/transactions": "Transactions",
  "/member/progress": "Progress",
  "/member/notifications": "Notifications",
  "/member/profile": "Profile",
};

export function Topbar({ role }: TopbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 backdrop-blur-xl px-4 lg:px-8">
      <div className="lg:hidden w-10" />
      <div className="hidden lg:flex items-center gap-3">
        <div>
          <p className="text-sm font-semibold font-display">{pageTitle}</p>
          <p className="text-[11px] text-muted-foreground">
            {role === "admin" ? "Admin Panel" : "Member Portal"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search..."
            className="pl-9 h-9 w-56 rounded-xl bg-muted/50 border-border/50 text-sm focus:w-72 transition-all"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl"
          onClick={() => navigate(role === "admin" ? "/admin" : "/member/notifications")}
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full gradient-bg text-[10px] font-bold text-primary-foreground shadow-sm">
            2
          </span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate("/")}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
