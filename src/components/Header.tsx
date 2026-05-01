import { Link } from "@tanstack/react-router";
import { ShoppingBag, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { count, setOpen } = useCart();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="bg-brand text-primary-foreground">
        <div className="container mx-auto flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-medium">
          <Phone className="h-3.5 w-3.5" />
          <a href="tel:+923049116786" className="hover:underline">
            Call / WhatsApp: 0304-9116786
          </a>
        </div>
      </div>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-[var(--font-display)] text-2xl font-bold tracking-tight text-brand">
            Sasti
          </span>
          <span className="text-2xl font-light tracking-widest text-foreground">Collection</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-brand">Home</Link>
          <Link to="/shop" className="text-sm font-medium text-foreground hover:text-brand">Shop</Link>
          <Link to="/about" className="text-sm font-medium text-foreground hover:text-brand">About</Link>
          <Link to="/contact" className="text-sm font-medium text-foreground hover:text-brand">Contact</Link>
        </nav>
        <button
          onClick={() => setOpen(true)}
          className="relative inline-flex items-center justify-center rounded-full bg-secondary p-2.5 text-foreground transition hover:bg-accent"
          aria-label="Open cart"
        >
          <ShoppingBag className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-primary-foreground">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
