import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/data/products";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { products, loading } = useProducts();

  return (
    <div>
      {/* All Products */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Our Collection</h2>
            <p className="mt-2 text-muted-foreground">Trendy Pakistani clothing at affordable prices.</p>
          </div>
          <Link to="/shop" className="hidden text-sm font-semibold text-brand hover:underline md:inline">
            View all →
          </Link>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading products...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
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
