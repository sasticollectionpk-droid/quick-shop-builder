import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/data/products";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Sasti Collection" },
      { name: "description", content: "Browse all Pakistani kurtas, suits and unstitched fabric at Sasti Collection." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { products, loading } = useProducts();
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const [cat, setCat] = useState<string>("All");
  const list = cat === "All" ? products : products.filter((p) => p.category === cat);
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-foreground">Shop All</h1>
      <p className="mt-2 text-muted-foreground">{list.length} products</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              cat === c ? "bg-brand text-primary-foreground" : "bg-secondary text-foreground hover:bg-accent"
            }`}
          >
            {c === "All" ? c : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading products...</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
