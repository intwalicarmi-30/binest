import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";

interface DashboardLayoutProps {
  role: "admin" | "member";
}

export function DashboardLayout({ role }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar role={role} />
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar role={role} />
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
