import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const ADMIN_EMAIL = "clearnesssale.pk@gmail.com";

const orderSchema = z.object({
  customer_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(10).max(20).regex(/^[0-9+\-\s]+$/),
  address: z.string().trim().min(5).max(300),
  city: z.string().trim().min(2).max(80),
  items: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        qty: z.number().int().positive(),
        image: z.string().optional(),
      }),
    )
    .min(1)
    .max(50),
  subtotal: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  delivery_charges: z.number().nonnegative(),
  grand_total: z.number().nonnegative(),
});

export const Route = createFileRoute("/api/public/place-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const parsed = orderSchema.safeParse(body);
          if (!parsed.success) {
            return new Response(
              JSON.stringify({ error: "Invalid order data", details: parsed.error.issues }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }
          const data = parsed.data;

          const supabaseUrl = process.env.SUPABASE_URL!;
          const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
          const supabase = createClient(supabaseUrl, serviceKey, {
            auth: { autoRefreshToken: false, persistSession: false },
          });

          const { data: order, error } = await supabase
            .from("orders")
            .insert({
              customer_name: data.customer_name,
              phone: data.phone,
              address: data.address,
              city: data.city,
              items: data.items,
              subtotal: data.subtotal,
              discount: data.discount,
              delivery_charges: data.delivery_charges,
              grand_total: data.grand_total,
            })
            .select()
            .single();

          if (error) {
            console.error("DB insert failed:", error);
            return new Response(JSON.stringify({ error: "Could not save order" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Send email via Resend
          const resendKey = process.env.RESEND_API_KEY;
          if (resendKey) {
            const itemsHtml = data.items
              .map(
                (i) =>
                  `<tr><td style="padding:6px;border-bottom:1px solid #eee">${escapeHtml(i.name)}</td><td style="padding:6px;border-bottom:1px solid #eee;text-align:center">${i.qty}</td><td style="padding:6px;border-bottom:1px solid #eee;text-align:right">Rs ${(i.price * i.qty).toLocaleString()}</td></tr>`,
              )
              .join("");

            const html = `
              <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:#fff">
                <h2 style="color:#c2410c">🎉 New Order — Sasti Collection</h2>
                <p><strong>Order ID:</strong> ${order.id}</p>
                <h3 style="margin-top:24px">Customer Details</h3>
                <p>
                  <strong>Name:</strong> ${escapeHtml(data.customer_name)}<br/>
                  <strong>Phone:</strong> ${escapeHtml(data.phone)}<br/>
                  <strong>Address:</strong> ${escapeHtml(data.address)}<br/>
                  <strong>City:</strong> ${escapeHtml(data.city)}
                </p>
                <h3 style="margin-top:24px">Items</h3>
                <table style="width:100%;border-collapse:collapse;font-size:14px">
                  <thead>
                    <tr style="background:#f5f5f5">
                      <th style="padding:6px;text-align:left">Product</th>
                      <th style="padding:6px;text-align:center">Qty</th>
                      <th style="padding:6px;text-align:right">Total</th>
                    </tr>
                  </thead>
                  <tbody>${itemsHtml}</tbody>
                </table>
                <div style="margin-top:20px;text-align:right;font-size:14px">
                  <p>Subtotal: Rs ${data.subtotal.toLocaleString()}</p>
                  ${data.discount > 0 ? `<p style="color:#16a34a">Discount: - Rs ${data.discount.toLocaleString()}</p>` : ""}
                  <p>Delivery: Rs ${data.delivery_charges.toLocaleString()}</p>
                  <p style="font-size:18px;font-weight:bold;color:#c2410c">Grand Total: Rs ${data.grand_total.toLocaleString()}</p>
                </div>
              </div>
            `;

            const emailRes = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${resendKey}`,
              },
              body: JSON.stringify({
                from: "Sasti Collection <onboarding@resend.dev>",
                to: [ADMIN_EMAIL],
                subject: `🛍️ New Order from ${data.customer_name} — Rs ${data.grand_total.toLocaleString()}`,
                html,
              }),
            });
            if (!emailRes.ok) {
              const errText = await emailRes.text();
              console.error("Resend failed:", emailRes.status, errText);
            }
          } else {
            console.warn("RESEND_API_KEY not set — skipping email");
          }

          return new Response(JSON.stringify({ success: true, orderId: order.id }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Order handler error:", err);
          return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
