import { ConsultantSidebar } from "@/components/consultant/Sidebar";
import { ConsultantHeader } from "@/components/consultant/Header";

export default function ConsultantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-50 transition-colors duration-200 font-sans">
            <ConsultantSidebar />
            <main className="flex-1 flex flex-col overflow-y-auto">
                <ConsultantHeader />
                {children}
            </main>
        </div>
    );
}
