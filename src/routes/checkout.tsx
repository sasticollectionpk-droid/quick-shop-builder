import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useCart } from "@/context/CartContext";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Sasti Collection" },
      { name: "description", content: "Complete your order at Sasti Collection. Cash on delivery available." },
      { property: "og:title", content: "Checkout — Sasti Collection" },
      { property: "og:description", content: "Complete your order at Sasti Collection." },
    ],
  }),
  component: CheckoutPage,
});

const orderSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  phone: z.string().trim().min(10, "Valid phone required").max(20).regex(/^[0-9+\-\s]+$/, "Invalid phone"),
  address: z.string().trim().min(5, "Address is required").max(300),
  city: z.string().trim().min(2, "City is required").max(80),
});

function CheckoutPage() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placed, setPlaced] = useState(false);

  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const discountPct = totalQty >= 10 ? 20 : 0;
  const discountAmount = Math.round((total * discountPct) / 100);
  const deliveryCharges = 350;
  const grandTotal = total - discountAmount + deliveryCharges;

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = orderSchema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        if (i.path[0]) errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setPlaced(true);
    clear();
  };

  if (placed) {
    return (
      <div className="container mx-auto max-w-xl px-4 py-16 text-center">
        <div className="rounded-2xl bg-card p-8 shadow-[var(--shadow-soft)]">
          <h1 className="text-3xl font-bold text-brand">Order Placed!</h1>
          <p className="mt-3 text-muted-foreground">
            Shukriya {form.name}! Hum jald hi aap se {form.phone} par rabta karenge.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add some products before checking out.</p>
        <button
          onClick={() => navigate({ to: "/" })}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
      <p className="mt-1 text-sm text-muted-foreground">Cash on Delivery available across Pakistan.</p>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="text-lg font-semibold text-foreground">Shipping Details</h2>

          <div>
            <label className="text-sm font-medium text-foreground">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={update("name")}
              maxLength={100}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
              placeholder="Aap ka pura naam"
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={update("phone")}
              maxLength={20}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
              placeholder="0300-1234567"
            />
            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Address</label>
            <textarea
              value={form.address}
              onChange={update("address")}
              maxLength={300}
              rows={3}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
              placeholder="House #, Street, Area"
            />
            {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">City</label>
            <input
              type="text"
              value={form.city}
              onChange={update("city")}
              maxLength={80}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
              placeholder="Karachi"
            />
            {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Place Order (Cash on Delivery)
          </button>
        </form>

        <aside className="h-fit rounded-2xl bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((i) => (
              <li key={i.id} className="flex gap-3 text-sm">
                <img src={i.image} alt={i.name} className="h-14 w-14 rounded-md object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{i.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {i.qty}</p>
                </div>
                <p className="font-semibold text-foreground">Rs {(i.price * i.qty).toLocaleString()}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">Rs {total.toLocaleString()}</span>
            </div>
            {discountPct > 0 && (
              <div className="flex justify-between text-brand">
                <span>Bulk Discount ({discountPct}% off — 10+ suits)</span>
                <span className="font-semibold">- Rs {discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Charges</span>
              <span className="font-medium text-foreground">Rs {deliveryCharges.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="font-semibold text-foreground">Grand Total</span>
              <span className="text-lg font-bold text-brand">Rs {grandTotal.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive">
            ⚠️ Sirf wohi order karein jo Rs {deliveryCharges} delivery charges de sakta ho.
          </div>
          {totalQty < 10 && (
            <div className="mt-2 rounded-lg bg-brand/10 p-3 text-xs font-medium text-brand">
              💡 Aur {10 - totalQty} suit add karein aur 20% OFF payein!
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
