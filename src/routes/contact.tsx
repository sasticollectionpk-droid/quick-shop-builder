import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Sasti Collection" },
      { name: "description", content: "Get in touch with Sasti Collection for orders, support, or wholesale inquiries." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-4xl font-bold text-foreground md:text-5xl">Contact Us</h1>
      <p className="mt-3 text-muted-foreground">We'd love to hear from you. Send us a message below.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="mt-8 space-y-4"
      >
        <input
          required
          placeholder="Your Name"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
        />
        <input
          required
          type="email"
          placeholder="Email"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
        />
        <textarea
          required
          rows={5}
          placeholder="Message"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
        />
        <button className="rounded-full bg-brand px-7 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
          {sent ? "Thank you! ✓" : "Send Message"}
        </button>
      </form>
    </div>
  );
}
