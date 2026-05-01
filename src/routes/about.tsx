import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Sasti Collection" },
      { name: "description", content: "Learn about Sasti Collection — affordable Pakistani fashion for everyone." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold text-foreground md:text-5xl">About Sasti Collection</h1>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        Sasti Collection started with a simple idea — beautiful Pakistani clothing shouldn't cost a fortune.
        We work directly with local manufacturers to bring you trendy kurtas, stitched suits, and premium
        unstitched lawn at prices that make sense.
      </p>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Every piece is made with care, comfort and quality in mind. From everyday wear to special occasions,
        we have something for everyone — without the heavy price tag.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          { n: "10K+", l: "Happy Customers" },
          { n: "500+", l: "Products" },
          { n: "4.8★", l: "Average Rating" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl bg-secondary p-6 text-center">
            <p className="text-3xl font-bold text-brand">{s.n}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
