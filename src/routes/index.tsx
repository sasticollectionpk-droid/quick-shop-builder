import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-fashion.jpg";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const featured = products.slice(0, 6);
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="container mx-auto grid items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="space-y-6">
            <span className="inline-block rounded-full bg-background/80 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
              New Summer Drop
            </span>
            <h1 className="text-5xl font-bold leading-tight text-foreground md:text-6xl">
              Sasti <span className="text-brand">Collection</span>
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              Trendy Pakistani clothing at prices you'll love. Quality kurtas, suits and unstitched lawn — without breaking the bank.
            </p>
            <div className="flex gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-full bg-brand px-7 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-90"
              >
                Shop Now
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-7 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroImg}
              alt="Pakistani woman wearing pink embroidered kurta"
              width={1600}
              height={900}
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-[var(--shadow-soft)]"
            />
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Featured Collection</h2>
            <p className="mt-2 text-muted-foreground">Handpicked styles you'll fall in love with.</p>
          </div>
          <Link to="/shop" className="hidden text-sm font-semibold text-brand hover:underline md:inline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Promise */}
      <section className="bg-secondary/40 py-12">
        <div className="container mx-auto grid gap-6 px-4 text-center md:grid-cols-3">
          {[
            { t: "Free Shipping", d: "On orders above Rs 2500" },
            { t: "Easy Exchange", d: "7-day exchange policy" },
            { t: "Cash on Delivery", d: "Pay when you receive" },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl bg-background p-6 shadow-[var(--shadow-card)]">
              <h3 className="text-lg font-semibold text-brand">{f.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
