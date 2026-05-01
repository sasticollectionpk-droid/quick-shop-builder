import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  badge?: string;
  description: string;
};

interface DbProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  old_price: number | null;
  image_url: string;
  category: string;
  badge: string | null;
}

function mapProduct(p: DbProduct): Product {
  return {
    id: p.id,
    name: p.name,
    price: Number(p.price),
    oldPrice: p.old_price ? Number(p.old_price) : undefined,
    image: p.image_url,
    category: p.category,
    badge: p.badge ?? undefined,
    description: p.description ?? "",
  };
}

// Static empty fallback so existing imports of `products` keep working.
export const products: Product[] = [];

export function useProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (mounted) {
        setItems(((data as DbProduct[]) ?? []).map(mapProduct));
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { products: items, loading };
}
