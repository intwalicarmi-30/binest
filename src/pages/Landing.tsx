import { PiggyBank, Shield, Users, TrendingUp, ArrowRight, Sparkles, BarChart3, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
  { icon: PiggyBank, title: "Collective Savings", desc: "Pool contributions together toward shared financial goals with full transparency." },
  { icon: Shield, title: "Transparent Tracking", desc: "Every contribution is recorded, timestamped, and visible to all group members." },
  { icon: Users, title: "Group Management", desc: "Easily manage members, roles, and contribution plans from one dashboard." },
  { icon: TrendingUp, title: "Progress Insights", desc: "Track collection trends and member payment status at a glance with visual reports." }];


  const stats = [
  { value: "2.4B+", label: "Total Saved" },
  { value: "12,000+", label: "Active Members" },
  { value: "98%", label: "Collection Rate" },
  { value: "500+", label: "Savings Groups" }];


  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg shadow-lg glow">
              <PiggyBank className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight font-display">Binest</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/login")} className="text-sm">Log in</Button>
            <Button onClick={() => navigate("/signup")} className="gradient-bg border-0 shadow-lg glow text-sm">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-float" />
          <div className="absolute top-40 right-0 w-80 h-80 rounded-full bg-info/5 blur-3xl animate-float-delayed" />
          <div className="absolute -bottom-20 left-1/2 w-[600px] h-64 rounded-full bg-primary/3 blur-3xl animate-float-slow" />
        </div>

        <div className="container relative py-20 lg:py-32 text-center">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-xs font-medium shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground">Community-powered savings platform</span>
            </div>

            <h1 className="animate-fade-in-up stagger-1 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl font-display leading-[1.1]">
              Save Together,{" "}
              <span className="gradient-text">Grow Together</span>
            </h1>

            <p className="animate-fade-in-up stagger-2 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A simple, transparent platform for savings groups, cooperatives, and communities
              to manage collective contributions and track progress — beautifully.
            </p>

            <div className="animate-fade-in-up stagger-3 flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <Button size="lg" onClick={() => navigate("/signup")} className="gradient-bg border-0 shadow-lg glow gap-2 text-base px-8 h-12">
                Start Saving <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="bg-card/50 backdrop-blur-sm text-base px-8 h-12">
                Log In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y bg-card/50 backdrop-blur-sm">
        <div className="container py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) =>
            <div key={s.label} className={`text-center animate-fade-in-up stagger-${i + 1}`}>
                <p className="text-2xl sm:text-3xl font-bold font-display gradient-text">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20 lg:py-28">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold font-display mb-3">Everything you need to manage savings</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Built for savings groups, cooperatives, and community finance with modern tools.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) =>
          <div key={f.title} className={`stat-card hover-lift space-y-4 animate-fade-in-up stagger-${i + 1}`}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-bg shadow-lg glow">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold font-display">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="gradient-hero-bg text-white py-20 lg:py-28">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          </div>
          <div className="container relative text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold font-display">Ready to start saving together?</h2>
            <p className="text-white/70 max-w-lg mx-auto">Join thousands of savings groups already using Binest to manage their finances.</p>
            <Button size="lg" onClick={() => navigate("/signup")} className="bg-white text-foreground hover:bg-white/90 shadow-xl gap-2 text-base px-8 h-12 mt-4">
              Create Your Group <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-10">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
              <PiggyBank className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold font-display">Binest</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Binest. All rights reserved.</p>
        </div>
      </footer>
    </div>);

}