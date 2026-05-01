export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-bold text-brand">Sasti Collection</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Quality clothing at prices that won't hurt your wallet.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Women</li>
            <li>Men</li>
            <li>Unstitched</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>support@sasticollection.pk</li>
            <li>0304-9116786</li>
            <li>Karachi, Pakistan</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Sasti Collection. All rights reserved.
      </div>
    </footer>
  );
}
