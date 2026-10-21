import { useMemo, useState } from "react";
import { Minus, Plus, Search, Star, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMenu } from "@/hooks/use-menu";
import { filterSortItems, rupees, type FoodItem, type SortKey } from "@/lib/menu-types";
import { orderMessage, whatsappLink } from "@/lib/kitchen";

export function PublicMenu() {
  const menu = useMenu();
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [qty, setQty] = useState<Record<string, number>>({});
  const catName = useMemo(() => Object.fromEntries(menu.categories.map((c) => [c.id, c.name])), [menu.categories]);
  const shown = filterSortItems(menu.items, { categoryId: cat, query: q, sort });
  const featured = menu.items.filter((i) => i.isFeatured && i.isAvailable).slice(0, 4);

  return (
    <section id="menu" className="mx-auto max-w-6xl px-5 py-24">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="eyebrow">What we cook</p>
        <h2 className="mt-3 text-4xl font-semibold md:text-5xl">From morning idli to evening chapati</h2>
        <p className="mt-4 text-muted-foreground">Pick a dish and quantity — we'll confirm availability and delivery time on WhatsApp.</p>
        {menu.status === "demo" && <p className="mx-auto mt-4 inline-block rounded-full bg-accent/30 px-4 py-1.5 text-xs font-medium">Sample menu — dishes and prices to be confirmed by the kitchen</p>}
      </div>

      {menu.status === "error" && (
        <div role="alert" className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-destructive/40 bg-destructive/5 p-5 text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
          <span>We couldn't load the menu right now ({menu.error}). Please message us on WhatsApp for today's menu.</span>
        </div>
      )}

      {menu.status === "loading" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-96 rounded-3xl" />)}</div>
      )}

      {(menu.status === "ready" || menu.status === "demo") && (
        <>
          {featured.length > 0 && cat === "all" && !q && (
            <div className="mb-14">
              <h3 className="mb-5 flex items-center gap-2 text-2xl font-semibold"><Star className="h-5 w-5 fill-accent text-accent" />Today's specials</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {featured.map((i) => (
                  <a key={i.id} href={whatsappLink(orderMessage({ name: i.name, category: catName[i.categoryId] ?? "" }, 1))} target="_blank" rel="noopener" className="group overflow-hidden rounded-2xl bg-card shadow-warm">
                    <img src={i.imageUrl} alt={i.name} loading="lazy" width={400} height={300} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="p-3"><p className="font-display font-semibold leading-tight">{i.name}</p><p className="text-sm text-primary">{rupees(i.price)}</p></div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div role="tablist" aria-label="Menu categories" className="flex flex-wrap gap-2">
              {[{ id: "all", name: "All" }, ...menu.categories].map((c) => (
                <button key={c.id} role="tab" aria-selected={cat === c.id} onClick={() => setCat(c.id)} className={`rounded-full border px-4 py-2 text-sm font-medium transition ${cat === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary"}`}>{c.name}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 md:w-56">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input aria-label="Search dishes" placeholder="Search dishes" value={q} onChange={(e) => setQ(e.target.value)} className="rounded-full bg-card pl-9" />
              </div>
              <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="h-9 rounded-full border border-input bg-card px-3 text-sm">
                <option value="featured">Popular</option><option value="price-asc">Price: low–high</option><option value="price-desc">Price: high–low</option><option value="name">A–Z</option>
              </select>
            </div>
          </div>

          {shown.length === 0 ? (
            <p className="rounded-2xl bg-secondary p-10 text-center text-muted-foreground">No dishes match{q ? ` "${q}"` : ""}. Try another category or search.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((m) => <Card key={m.id} m={m} cat={catName[m.categoryId] ?? ""} q={qty[m.id] ?? 1} setQ={(n) => setQty({ ...qty, [m.id]: n })} />)}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function Card({ m, cat, q, setQ }: { m: FoodItem; cat: string; q: number; setQ: (n: number) => void }) {
  const off = !m.isAvailable;
  return (
    <article className={`group overflow-hidden rounded-3xl border border-border bg-card transition ${off ? "opacity-70" : "hover:-translate-y-1 hover:shadow-warm"}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={m.imageUrl} alt={m.name} loading="lazy" width={800} height={600} className={`h-full w-full object-cover transition duration-700 ${off ? "grayscale" : "group-hover:scale-105"}`} />
        {off && <span className="absolute left-4 top-4 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">Sold out</span>}
        {m.isFeatured && !off && <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">Special</span>}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-chili">
          <span aria-label="Vegetarian" className="grid h-4 w-4 place-items-center rounded-sm border border-primary"><span className="h-2 w-2 rounded-full bg-primary" /></span>
          {cat}{m.foodType === "jain" && <span className="rounded bg-secondary px-1.5 text-secondary-foreground">Jain</span>}
        </div>
        <div className="mt-1 flex items-start justify-between gap-3">
          <h3 className="text-2xl font-semibold">{m.name}</h3>
          <p className="font-display text-xl font-semibold text-primary">{rupees(m.price)}</p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>
        {m.preparationTime ? <p className="mt-1 text-xs text-muted-foreground">Ready in ~{m.preparationTime} min</p> : null}
        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex items-center rounded-full border border-border">
            <button disabled={off} aria-label={`Fewer ${m.name}`} className="p-2.5 disabled:opacity-40" onClick={() => setQ(Math.max(1, q - 1))}><Minus className="h-4 w-4" /></button>
            <span className="w-6 text-center text-sm font-semibold" aria-live="polite">{q}</span>
            <button disabled={off} aria-label={`More ${m.name}`} className="p-2.5 disabled:opacity-40" onClick={() => setQ(q + 1)}><Plus className="h-4 w-4" /></button>
          </div>
          {off ? <Button size="sm" disabled className="rounded-full px-4">Unavailable</Button> : (
            <Button asChild variant="whatsapp" size="sm" className="px-4"><a href={whatsappLink(orderMessage({ name: m.name, category: cat }, q))} target="_blank" rel="noopener">Order · {rupees(m.price * q)}</a></Button>
          )}
        </div>
      </div>
    </article>
  );
}
