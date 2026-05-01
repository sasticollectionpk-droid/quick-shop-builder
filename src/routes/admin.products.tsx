import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  old_price: number | null;
  image_url: string;
  category: string;
  badge: string | null;
  is_active: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showCatModal, setShowCatModal] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
    ]);
    setProducts((p as Product[]) ?? []);
    setCategories((c as Category[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) alert(error.message);
    else load();
  };

  const newProduct = (): Product => ({
    id: "",
    name: "",
    description: "",
    price: 0,
    old_price: null,
    image_url: "",
    category: categories[0]?.slug ?? "",
    badge: null,
    is_active: true,
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your store catalog.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCatModal(true)}
            className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary"
          >
            Categories
          </button>
          <button
            onClick={() => setEditing(newProduct())}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl bg-background shadow-[var(--shadow-card)]">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50 text-left">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3 hidden sm:table-cell">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3 hidden md:table-cell">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="p-3">
                    <img src={p.image_url} alt={p.name} className="h-12 w-12 rounded-md object-cover" />
                  </td>
                  <td className="p-3 font-medium text-foreground">{p.name}</td>
                  <td className="p-3 text-muted-foreground hidden sm:table-cell capitalize">{p.category}</td>
                  <td className="p-3 font-semibold">Rs {Number(p.price).toLocaleString()}</td>
                  <td className="p-3 hidden md:table-cell">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${p.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {p.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => setEditing(p)} className="mr-2 inline-flex items-center text-foreground hover:text-brand">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-destructive hover:opacity-80">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No products yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <ProductModal
          product={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}

      {showCatModal && (
        <CategoryModal
          categories={categories}
          onClose={() => setShowCatModal(false)}
          onChanged={() => load()}
        />
      )}
    </div>
  );
}

function ProductModal({
  product,
  categories,
  onClose,
  onSaved,
}: {
  product: Product;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(product);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const isNew = !form.id;

  const save = async () => {
    setErr("");
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        old_price: form.old_price ? Number(form.old_price) : null,
        image_url: form.image_url,
        category: form.category,
        badge: form.badge || null,
        is_active: form.is_active,
      };
      const { error } = isNew
        ? await supabase.from("products").insert(payload)
        : await supabase.from("products").update(payload).eq("id", form.id);
      if (error) throw error;
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-background p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">{isNew ? "New Product" : "Edit Product"}</h2>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-4 space-y-3">
          <Field label="Name">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Description">
            <textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={inputCls} />
          </Field>
          <Field label="Image URL">
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="/assets/img.jpg or https://…" className={inputCls} />
            {form.image_url && <img src={form.image_url} alt="preview" className="mt-2 h-24 w-24 rounded-md object-cover" />}
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (Rs)">
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className={inputCls} />
            </Field>
            <Field label="Old Price (optional)">
              <input type="number" value={form.old_price ?? ""} onChange={(e) => setForm({ ...form, old_price: e.target.value ? Number(e.target.value) : null })} className={inputCls} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Badge (optional)">
              <input value={form.badge ?? ""} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="New, Sale…" className={inputCls} />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Active (visible to customers)
          </label>
          {err && <p className="rounded-lg bg-destructive/10 p-2 text-xs text-destructive">{err}</p>}
        </div>
        <div className="mt-6 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-full border border-border py-2 text-sm">Cancel</button>
          <button onClick={save} disabled={saving} className="flex-1 rounded-full bg-brand py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryModal({
  categories,
  onClose,
  onChanged,
}: {
  categories: Category[];
  onClose: () => void;
  onChanged: () => void;
}) {
  const [name, setName] = useState("");
  const [err, setErr] = useState("");

  const add = async () => {
    setErr("");
    const slug = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (!slug) return;
    const { error } = await supabase.from("categories").insert({ name: name.trim(), slug });
    if (error) setErr(error.message);
    else {
      setName("");
      onChanged();
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) alert(error.message);
    else onChanged();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Categories</h2>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <ul className="mt-4 space-y-2">
          {categories.map((c) => (
            <li key={c.id} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2 text-sm">
              <span className="font-medium">{c.name} <span className="text-muted-foreground">({c.slug})</span></span>
              <button onClick={() => del(c.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New category name"
            className={inputCls}
          />
          <button onClick={add} className="rounded-full bg-brand px-4 text-sm font-semibold text-primary-foreground">Add</button>
        </div>
        {err && <p className="mt-2 rounded-lg bg-destructive/10 p-2 text-xs text-destructive">{err}</p>}
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
