import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-soft)]">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={768}
          height={768}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.category}</p>
          <h3 className="mt-1 font-semibold text-foreground">{product.name}</h3>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">Rs {product.price.toLocaleString()}</span>
            {product.oldPrice && (
              <span className="text-sm text-muted-foreground line-through">
                Rs {product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={() => add(product)}
            className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition hover:bg-brand"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
