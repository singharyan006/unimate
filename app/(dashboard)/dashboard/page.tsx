import { Card } from "@/components/ui/card" // Assuming Card exists or I will create it
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
    return (
        <div className="p-8">
            <div className="mb-8 space-y-4">
                <h2 className="text-2xl md:text-4xl font-bold">Welcome back! 👋</h2>
                <p className="text-muted-foreground font-light">
                    Here is an overview of your college application journey.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Simple Stat Cards */}
                <div className="p-6 border rounded-xl bg-card shadow-sm">
                    <div className="font-semibold text-sm text-muted-foreground">Upcoming Sessions</div>
                    <div className="mt-2 text-3xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground mt-1">No sessions booked yet.</p>
                </div>
                <div className="p-6 border rounded-xl bg-card shadow-sm">
                    <div className="font-semibold text-sm text-muted-foreground">Mentors Viewed</div>
                    <div className="mt-2 text-3xl font-bold">12</div>
                </div>
                <div className="p-6 border rounded-xl bg-card shadow-sm flex flex-col justify-between">
                    <div className="font-semibold text-sm text-muted-foreground">Action</div>
                    <Button className="w-full mt-2">Find a Mentor</Button>
                </div>
            </div>
        </div>
    )
}
