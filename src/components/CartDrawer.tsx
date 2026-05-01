import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, total, clear } = useCart();
  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-foreground/40 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold text-foreground">Your Cart</h2>
          <button onClick={() => setOpen(false)} aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="mt-12 text-center text-sm text-muted-foreground">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((i) => (
                <li key={i.id} className="flex gap-3 rounded-xl bg-secondary/50 p-3">
                  <img src={i.image} alt={i.name} className="h-20 w-20 rounded-lg object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{i.name}</p>
                      <button onClick={() => remove(i.id)} aria-label="Remove">
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                    <p className="text-sm text-brand font-semibold">Rs {(i.price * i.qty).toLocaleString()}</p>
                    <div className="mt-auto flex items-center gap-2">
                      <button onClick={() => setQty(i.id, i.qty - 1)} className="rounded-md bg-background p-1">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-6 text-center text-sm">{i.qty}</span>
                      <button onClick={() => setQty(i.id, i.qty + 1)} className="rounded-md bg-background p-1">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-border p-4">
            <div className="mb-3 flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="text-lg font-bold text-foreground">Rs {total.toLocaleString()}</span>
            </div>
            <button className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
              Checkout
            </button>
            <button onClick={clear} className="mt-2 w-full text-xs text-muted-foreground hover:underline">
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
