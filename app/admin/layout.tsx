import { AdminSidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-50 transition-colors duration-200 font-sans">
            <AdminSidebar />
            <main className="flex-1 ml-64 flex flex-col min-h-screen">
                {children}
            </main>
        </div>
    );
}
