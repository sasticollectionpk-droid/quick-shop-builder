import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if any admin exists; if not, default to signup
    supabase
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin")
      .then(({ count }) => {
        const exists = (count ?? 0) > 0;
        setHasAdmin(exists);
        if (!exists) setMode("signup");
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error: signErr } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (signErr) throw signErr;
        if (data.session) {
          // Claim admin role for the very first signup
          await supabase.rpc("claim_first_admin");
          navigate({ to: "/admin" });
          return;
        }
        setError("Check your email to confirm, then sign in.");
      } else {
        const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signErr) throw signErr;
        navigate({ to: "/admin" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
      <div className="w-full rounded-2xl bg-card p-8 shadow-[var(--shadow-soft)]">
        <h1 className="text-2xl font-bold text-foreground">Admin {mode === "signup" ? "Setup" : "Login"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signup"
            ? hasAdmin === false
              ? "Create the first admin account."
              : "Sign up for an admin account."
            : "Sign in to manage products and orders."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          {error && <p className="rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Please wait..." : mode === "signup" ? "Create Account" : "Sign In"}
          </button>
        </form>

        {hasAdmin !== false && (
          <button
            onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
            className="mt-4 w-full text-xs text-muted-foreground hover:underline"
          >
            {mode === "signin" ? "Need to create admin? Sign up" : "Already have account? Sign in"}
          </button>
        )}

        <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground hover:underline">
          ← Back to store
        </Link>
      </div>
    </div>
  );
}
