import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiggyBank, ArrowRight, Shield, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Fetch role to redirect correctly
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);

        const roles = roleData?.map((r) => r.role) ?? [];

        if (roles.includes("admin")) {
          navigate("/admin");
        } else {
          navigate("/member");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel - Visual */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero-bg relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-white/5 blur-3xl animate-float-delayed" />
        </div>
        <div className="relative z-10 max-w-md space-y-8 text-white">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <PiggyBank className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-bold font-display leading-tight">
            Manage your collective savings with confidence.
          </h2>
          <p className="text-white/60 leading-relaxed">
            Track contributions, manage members, and grow your savings group — all in one platform.
          </p>
          <div className="space-y-4 pt-4">
            {[
              { icon: Shield, text: "Transparent & trustworthy" },
              { icon: TrendingUp, text: "Real-time progress tracking" },
              { icon: Users, text: "Built for groups & cooperatives" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-white/80">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex flex-1 items-center justify-center bg-background p-6 lg:p-12">
        <div className="w-full max-w-sm space-y-8 animate-fade-in">
          <div className="text-center space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-bg shadow-lg glow">
                <PiggyBank className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold font-display lg:hidden">Binest</span>
            </Link>
            <h1 className="text-2xl font-bold font-display pt-2">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-xl bg-muted/50 border-border/50 focus:bg-card transition-colors"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80 transition-colors">Forgot password?</Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-xl bg-muted/50 border-border/50 focus:bg-card transition-colors"
              />
            </div>
            <Button type="submit" className="w-full h-11 rounded-xl gradient-bg border-0 shadow-lg glow gap-2 text-sm font-semibold" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : (
                <>Sign In <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:text-primary/80 font-semibold transition-colors">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
