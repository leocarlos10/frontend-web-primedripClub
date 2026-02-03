import { useState, type ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-300 flex">
      <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main className="flex-1 flex flex-col md:ml-64">
        <AdminHeader title={title} onMenuClick={toggleSidebar} />

        <div className="p-8 flex-1">{children}</div>

        <AdminFooter />
      </main>
    </div>
  );
}
