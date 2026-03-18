import { PiggyBank, Shield, Users, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    { icon: PiggyBank, title: "Collective Savings", desc: "Pool contributions together toward shared financial goals." },
    { icon: Shield, title: "Transparent Tracking", desc: "Every contribution is recorded and visible to all members." },
    { icon: Users, title: "Group Management", desc: "Easily manage members, roles, and contribution plans." },
    { icon: TrendingUp, title: "Progress Insights", desc: "Track collection trends and member payment status at a glance." },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <PiggyBank className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">SaveCollective</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/login")}>Log in</Button>
            <Button onClick={() => navigate("/signup")}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-20 lg:py-32 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="inline-flex items-center rounded-full border bg-accent px-4 py-1.5 text-xs font-medium text-accent-foreground">
            Community-powered savings platform
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Save Together,{" "}
            <span className="text-primary">Grow Together</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple, transparent platform for savings groups, cooperatives, and communities
            to manage collective contributions and track progress.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button size="lg" onClick={() => navigate("/signup")} className="gap-2">
              Start Saving <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
              Log In
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="stat-card space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © 2024 SaveCollective. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
