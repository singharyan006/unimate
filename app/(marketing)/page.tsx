import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import Link from "next/link"
import { Search, MapPin, GraduationCap, Star } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto text-center z-10 relative">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground mb-6 bg-secondary/50 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Over 500+ verified mentors available
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 max-w-4xl mx-auto leading-tight">
            Master your college journey with <span className="text-primary">verified mentors.</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Book 1:1 video sessions with students from top universities. Get real advice, essay reviews, and strategy checks.
          </p>

          {/* Search Bar Simulation */}
          <div className="max-w-xl mx-auto bg-card p-2 rounded-full shadow-lg border flex items-center gap-2 pl-4 mb-12">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by university, major, or name..."
              className="flex-1 bg-transparent border-none outline-none text-sm h-10"
            />
            <Button size="lg" className="rounded-full">Find Mentors</Button>
          </div>

          {/* Trust Tags */}
          <div className="text-sm text-muted-foreground mb-4">Trusted by students accepted into</div>
          <div className="flex flex-wrap justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Simple Text Placeholders for Logos */}
            <span className="font-bold text-lg">Harvard</span>
            <span className="font-bold text-lg">Stanford</span>
            <span className="font-bold text-lg">MIT</span>
            <span className="font-bold text-lg">Yale</span>
            <span className="font-bold text-lg">Princeton</span>
            <span className="font-bold text-lg">Columbia</span>
          </div>
        </div>

        {/* Abstract Background Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Featured Mentors Grid */}
      <section className="py-20 bg-secondary/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Meet our featured mentors</h2>
            <Link href="/mentors">
              <Button variant="ghost" className="text-primary">View all mentors &rarr;</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mock Mentor Cards */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group relative bg-card rounded-xl border hover:shadow-lg transition-all duration-300 overflow-hidden">
                {/* Banner/Color Strip */}
                <div className={`h-24 w-full ${['bg-blue-100', 'bg-red-100', 'bg-green-100', 'bg-purple-100'][i - 1]}`}></div>

                {/* Profile Image (Placeholder) */}
                <div className="absolute top-12 left-6 h-20 w-20 rounded-xl border-4 border-card bg-gray-200 shadow-sm overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="Mentor" className="h-full w-full object-cover" />
                </div>

                <div className="pt-10 pb-6 px-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">Sarah Jenkins</h3>
                      <p className="text-sm text-muted-foreground">Computer Science</p>
                    </div>
                    <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded text-xs font-medium">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      4.9
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>Stanford University '25</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>English, Spanish</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t flex items-center justify-between">
                    <span className="font-bold text-lg">$40<span className="text-xs font-normal text-muted-foreground">/session</span></span>
                    <Button size="sm" variant="outline" className="rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">Book</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container px-4 md:px-6 mx-auto text-center text-muted-foreground">
          <p>&copy; 2026 Unimate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
