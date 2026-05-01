import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  delivery_charges: number;
  grand_total: number;
  status: string;
  created_at: string;
}

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data as unknown as Order[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) alert(error.message);
    else load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">All customer orders.</p>

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((o) => {
            const isOpen = expanded === o.id;
            return (
              <div key={o.id} className="rounded-2xl bg-background shadow-[var(--shadow-card)]">
                <button
                  onClick={() => setExpanded(isOpen ? null : o.id)}
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  {isOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{o.customer_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.phone} • {new Date(o.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand">Rs {Number(o.grand_total).toLocaleString()}</p>
                    <span className={`text-xs rounded-full px-2 py-0.5 capitalize ${
                      o.status === "delivered" ? "bg-green-100 text-green-700" :
                      o.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{o.status}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-border p-4 space-y-3 text-sm">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Address</p>
                      <p className="mt-1">{o.address}, {o.city}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Items</p>
                      <ul className="mt-1 space-y-1">
                        {o.items.map((it, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>{it.name} × {it.qty}</span>
                            <span>Rs {(it.price * it.qty).toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 text-xs">
                      <span>Subtotal: Rs {Number(o.subtotal).toLocaleString()}</span>
                      {Number(o.discount) > 0 && <span className="text-green-600">- Rs {Number(o.discount).toLocaleString()}</span>}
                      <span>+ Rs {Number(o.delivery_charges).toLocaleString()} delivery</span>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</label>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm capitalize"
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
