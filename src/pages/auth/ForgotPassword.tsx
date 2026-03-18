import { useState } from "react";
import { Link } from "react-router-dom";
import { PiggyBank, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setSent(true); setLoading(false); }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-lg bg-primary">
            <PiggyBank className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Reset password</h1>
          <p className="text-sm text-muted-foreground">
            {sent ? "Check your email for reset instructions." : "Enter your email to receive a reset link."}
          </p>
        </div>
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        ) : (
          <Button variant="outline" className="w-full" asChild>
            <Link to="/login"><ArrowLeft className="mr-2 h-4 w-4" /> Back to login</Link>
          </Button>
        )}
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/login" className="text-primary hover:underline font-medium">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
