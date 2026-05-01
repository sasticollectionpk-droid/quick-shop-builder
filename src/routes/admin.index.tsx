import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, ShoppingBag, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    (async () => {
      const [{ count: products }, { data: orders }] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("grand_total"),
      ]);
      const revenue = (orders ?? []).reduce((s, o) => s + Number(o.grand_total), 0);
      setStats({ products: products ?? 0, orders: orders?.length ?? 0, revenue });
    })();
  }, []);

  const cards = [
    { label: "Total Products", value: stats.products, icon: Package, color: "text-blue-600" },
    { label: "Total Orders", value: stats.orders, icon: ShoppingBag, color: "text-green-600" },
    { label: "Total Revenue", value: `Rs ${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: "text-brand" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Welcome back! Here's an overview.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-background p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{c.label}</p>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </div>
            <p className="mt-3 text-3xl font-bold text-foreground">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
