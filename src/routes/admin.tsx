import { createFileRoute, Link, Outlet, useNavigate, useRouterState, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Package, ShoppingBag, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsAdmin(true);
      return;
    }
    (async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        navigate({ to: "/admin/login" });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!roles);
    })();
  }, [pathname, navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  if (pathname === "/admin/login") return <Outlet />;

  if (isAdmin === null) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto max-w-md p-8 text-center">
        <h1 className="text-xl font-bold text-destructive">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You're signed in but not an admin. Contact the site owner.
        </p>
        <button onClick={signOut} className="mt-4 rounded-full bg-brand px-6 py-2 text-sm text-primary-foreground">
          Sign out
        </button>
      </div>
    );
  }

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  ];

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <aside className="hidden w-60 flex-col border-r border-border bg-background p-4 md:flex">
        <Link to="/" className="mb-6 px-2 text-lg font-bold text-brand">
          Sasti Admin
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active ? "bg-brand text-primary-foreground" : "text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={signOut}
          className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <Link to="/" className="text-base font-bold text-brand">Sasti Admin</Link>
        <button onClick={signOut} className="text-xs text-muted-foreground">Sign out</button>
      </div>

      <main className="flex-1 p-4 pt-16 md:p-8 md:pt-8">
        {/* Mobile nav */}
        <nav className="mb-4 flex gap-2 overflow-x-auto md:hidden">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
                  active ? "bg-brand text-primary-foreground" : "bg-background text-foreground"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Outlet />
      </main>
    </div>
  );
}
