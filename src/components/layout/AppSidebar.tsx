import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, ArrowLeftRight, Settings, BarChart3,
  PiggyBank, PlusCircle, Wallet, TrendingUp, Bell, User,
  ChevronLeft, Menu, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NavItem { label: string; path: string; icon: React.ElementType; }

const adminNav: NavItem[] = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Members", path: "/admin/members", icon: Users },
  { label: "Contributions", path: "/admin/contributions", icon: PiggyBank },
  { label: "Add Payment", path: "/admin/add-payment", icon: PlusCircle },
  { label: "Transactions", path: "/admin/transactions", icon: ArrowLeftRight },
  { label: "Reports", path: "/admin/reports", icon: BarChart3 },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

const memberNav: NavItem[] = [
  { label: "Dashboard", path: "/member", icon: LayoutDashboard },
  { label: "My Contributions", path: "/member/contributions", icon: Wallet },
  { label: "Transactions", path: "/member/transactions", icon: ArrowLeftRight },
  { label: "Progress", path: "/member/progress", icon: TrendingUp },
  { label: "Notifications", path: "/member/notifications", icon: Bell },
  { label: "Profile", path: "/member/profile", icon: User },
];

interface AppSidebarProps { role: "admin" | "member"; }

export function AppSidebar({ role }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const items = role === "admin" ? adminNav : memberNav;

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden fixed top-0 left-0 z-40">
        <Button variant="ghost" size="icon" className="m-3 bg-card shadow-lg border rounded-xl" onClick={() => setCollapsed(false)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile backdrop */}
      {!collapsed && (
        <div className="lg:hidden fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm" onClick={() => setCollapsed(true)} />
      )}

      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-50 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-0 lg:w-[72px] overflow-hidden" : "w-64"
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary shadow-lg">
                <PiggyBank className="h-4 w-4 text-sidebar-primary-foreground" />
              </div>
              <span className="text-sm font-bold tracking-tight font-display">SaveCollective</span>
            </div>
          )}
          <Button
            variant="ghost" size="icon"
            className="h-8 w-8 text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground rounded-lg"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform duration-300", collapsed && "rotate-180")} />
          </Button>
        </div>

        {/* Category label */}
        {!collapsed && (
          <div className="px-4 pt-5 pb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/30">
              {role === "admin" ? "Administration" : "My Account"}
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 pb-3 overflow-y-auto">
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => { if (window.innerWidth < 1024) setCollapsed(true); }}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className={cn("h-[18px] w-[18px] shrink-0", isActive && "drop-shadow-sm")} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3 space-y-2">
          {!collapsed && (
            <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/50 px-3 py-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary/20 text-xs font-bold text-sidebar-primary">
                {role === "admin" ? "SO" : "JA"}
              </div>
              <div className="text-xs flex-1 min-w-0">
                <p className="font-semibold truncate">{role === "admin" ? "Sarah Okonkwo" : "James Adeyemi"}</p>
                <p className="text-sidebar-foreground/40 capitalize">{role}</p>
              </div>
              <Button
                variant="ghost" size="icon"
                className="h-7 w-7 text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground rounded-lg shrink-0"
                onClick={() => navigate("/")}
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
