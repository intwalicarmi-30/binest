import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  Settings,
  BarChart3,
  PiggyBank,
  PlusCircle,
  Wallet,
  TrendingUp,
  Bell,
  User,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

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

interface AppSidebarProps {
  role: "admin" | "member";
}

export function AppSidebar({ role }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const items = role === "admin" ? adminNav : memberNav;

  return (
    <>
      {/* Mobile overlay */}
      <div className="lg:hidden fixed top-0 left-0 z-40">
        <Button
          variant="ghost"
          size="icon"
          className="m-3 bg-card shadow-md border"
          onClick={() => setCollapsed(false)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar backdrop on mobile */}
      {!collapsed && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 flex h-screen flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
          collapsed ? "w-0 lg:w-16 overflow-hidden" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <PiggyBank className="h-4 w-4 text-sidebar-primary-foreground" />
              </div>
              <span className="text-sm font-bold tracking-tight">SaveCollective</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) setCollapsed(true);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-xs font-bold text-sidebar-accent-foreground">
                {role === "admin" ? "SO" : "JA"}
              </div>
              <div className="text-xs">
                <p className="font-medium">{role === "admin" ? "Sarah Okonkwo" : "James Adeyemi"}</p>
                <p className="text-sidebar-foreground/50 capitalize">{role}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
