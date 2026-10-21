import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { toast } from "sonner";
import { LayoutDashboard, UtensilsCrossed, Tags, LogOut, Plus, Pencil, Trash2, Loader2, Leaf, AlertTriangle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ItemForm } from "@/components/admin/ItemForm";
import { useMenu } from "@/hooks/use-menu";
import { fb, firebaseConfigured, firebaseErrorMessage } from "@/lib/firebase";
import { deleteCategory, isAdmin, removeItem, saveCategory, seedDemoMenu, updateItem } from "@/lib/admin-api";
import { itemsInCategory, rupees, type Category, type FoodItem } from "@/lib/menu-types";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Kitchen Admin — Shaiva's Swayampaaka" },
      { name: "description", content: "Staff area for managing the Shaiva's Swayampaaka menu." },
      { property: "og:title", content: "Kitchen Admin — Shaiva's Swayampaaka" },
      { property: "og:description", content: "Staff-only menu management." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type AuthState = { s: "loading" } | { s: "out" } | { s: "denied"; user: User } | { s: "in"; user: User } | { s: "error"; msg: string };

function AdminPage() {
  const [auth, setAuth] = useState<AuthState>({ s: "loading" });
  useEffect(() => {
    if (!firebaseConfigured) return;
    return onAuthStateChanged(fb().auth, async (u) => {
      if (!u) return setAuth({ s: "out" });
      try { setAuth((await isAdmin(u.uid)) ? { s: "in", user: u } : { s: "denied", user: u }); }
      catch (e) { setAuth({ s: "error", msg: firebaseErrorMessage(e) }); }
    });
  }, []);

  if (!firebaseConfigured) return <Shell><Notice title="Firebase isn't connected yet">The admin panel needs your Firebase project settings. Follow FIREBASE_SETUP.md, then reload this page.</Notice></Shell>;
  if (auth.s === "loading") return <Shell><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></Shell>;
  if (auth.s === "error") return <Shell><Notice title="Couldn't check your access">{auth.msg}</Notice></Shell>;
  if (auth.s === "out") return <Shell><Login /></Shell>;
  if (auth.s === "denied") return <Shell><Notice title="This account isn't an admin">Signed in as {auth.user.email}. Ask the owner to add your account as an admin. <Button variant="outline" className="mt-4" onClick={() => signOut(fb().auth)}>Sign out</Button></Notice></Shell>;
  return <Dashboard user={auth.user} />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="grid min-h-screen place-items-center bg-secondary px-5"><div className="w-full max-w-md">{children}</div></div>;
}
function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return <div role="alert" className="rounded-3xl bg-card p-8 text-center shadow-warm"><AlertTriangle className="mx-auto h-8 w-8 text-chili" /><h1 className="mt-3 text-2xl font-semibold">{title}</h1><div className="mt-2 flex flex-col items-center text-sm text-muted-foreground">{children}</div></div>;
}

function Login() {
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim(); const pw = String(f.get("password") ?? "");
    if (!email || !pw) return setErr("Enter your email and password.");
    setBusy(true); setErr("");
    try { await signInWithEmailAndPassword(fb().auth, email, pw); } catch (x) { setErr(firebaseErrorMessage(x)); } finally { setBusy(false); }
  }
  return (
    <form onSubmit={submit} noValidate className="rounded-3xl bg-card p-8 shadow-warm">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground"><Leaf /></span>
      <h1 className="mt-4 text-3xl font-semibold">Kitchen admin</h1>
      <p className="mt-1 text-sm text-muted-foreground">Sign in to manage the menu.</p>
      <div className="mt-6 space-y-4">
        <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" /></div>
        <div className="space-y-1.5"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" autoComplete="current-password" /></div>
        {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
        <Button type="submit" className="w-full" size="lg" disabled={busy}>{busy && <Loader2 className="animate-spin" />}Sign in</Button>
      </div>
      <Link to="/" className="mt-6 block text-center text-sm text-muted-foreground hover:text-foreground">← Back to website</Link>
    </form>
  );
}

type Tab = "dashboard" | "menu" | "categories";

function Dashboard({ user }: { user: User }) {
  const menu = useMenu();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [editing, setEditing] = useState<FoodItem | null | "new">(null);
  const nav: [Tab, string, typeof LayoutDashboard][] = [["dashboard", "Dashboard", LayoutDashboard], ["menu", "Menu", UtensilsCrossed], ["categories", "Categories", Tags]];

  return (
    <div className="min-h-screen bg-secondary md:flex">
      <aside className="flex items-center justify-between gap-2 bg-leaf-deep p-3 text-leaf-deep-foreground md:sticky md:top-0 md:h-screen md:w-60 md:flex-col md:items-stretch md:justify-start md:p-5">
        <p className="hidden font-display text-xl font-semibold md:block">Swayampaaka<br /><span className="text-sm font-normal opacity-70">Admin</span></p>
        <nav className="flex gap-1 md:mt-8 md:flex-col">
          {nav.map(([id, l, I]) => (
            <button key={id} onClick={() => setTab(id)} aria-current={tab === id} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${tab === id ? "bg-leaf-deep-foreground/15" : "opacity-80 hover:opacity-100"}`}><I className="h-4 w-4" /><span className="hidden sm:inline">{l}</span></button>
          ))}
        </nav>
        <div className="md:mt-auto">
          <p className="hidden truncate text-xs opacity-70 md:block">{user.email}</p>
          <Button variant="heroOutline" size="sm" className="md:mt-2 md:w-full" onClick={async () => { await signOut(fb().auth); toast("Signed out"); }}><LogOut />Sign out</Button>
        </div>
      </aside>
      <main className="flex-1 p-5 md:p-10">
        {menu.status === "loading" && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
        {menu.status === "error" && <p role="alert" className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">Couldn't load menu: {menu.error}</p>}
        {menu.status === "ready" && (
          <>
            {tab === "dashboard" && <Overview items={menu.items} categories={menu.categories} go={setTab} add={() => setEditing("new")} />}
            {tab === "menu" && <MenuTable items={menu.items} categories={menu.categories} edit={setEditing} />}
            {tab === "categories" && <Categories items={menu.items} categories={menu.categories} />}
          </>
        )}
      </main>
      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>{editing === "new" ? "Add a dish" : "Edit dish"}</DialogTitle></DialogHeader>
          {editing !== null && <ItemForm item={editing === "new" ? null : editing} categories={menu.categories} items={menu.items} onDone={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Overview({ items, categories, go, add }: { items: FoodItem[]; categories: Category[]; go: (t: Tab) => void; add: () => void }) {
  const [seeding, setSeeding] = useState(false);
  const stats = [["Dishes", items.length], ["Available", items.filter((i) => i.isAvailable).length], ["Sold out", items.filter((i) => !i.isAvailable).length], ["Categories", categories.length]] as const;
  return (
    <div>
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(([l, n]) => <div key={l} className="rounded-2xl bg-card p-5"><p className="text-sm text-muted-foreground">{l}</p><p className="mt-1 font-display text-4xl font-semibold">{n}</p></div>)}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={add} disabled={!categories.length}><Plus />Add dish</Button>
        <Button variant="outline" onClick={() => go("menu")}>Edit menu</Button>
        <Button variant="outline" onClick={() => go("categories")}>Manage categories</Button>
      </div>
      {items.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Your menu is empty</h2>
          <p className="mt-1 text-sm text-muted-foreground">Load {36} sample dishes in 6 categories to start from, then edit names, prices and photos.</p>
          <Button className="mt-4" disabled={seeding} onClick={async () => { setSeeding(true); try { await seedDemoMenu(); toast.success("Sample menu loaded"); } catch (e) { toast.error(firebaseErrorMessage(e)); } finally { setSeeding(false); } }}>{seeding && <Loader2 className="animate-spin" />}Load sample menu</Button>
        </div>
      )}
    </div>
  );
}

function MenuTable({ items, categories, edit }: { items: FoodItem[]; categories: Category[]; edit: (i: FoodItem | "new") => void }) {
  const [q, setQ] = useState(""); const [del, setDel] = useState<FoodItem | null>(null); const [busy, setBusy] = useState(false);
  const cat = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const shown = items.filter((i) => i.name.toLowerCase().includes(q.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Menu</h1>
        <div className="flex gap-2"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search dishes" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} className="bg-card pl-9" /></div><Button onClick={() => edit("new")} disabled={!categories.length}><Plus />Add dish</Button></div>
      </div>
      {shown.length === 0 ? <p className="mt-8 rounded-2xl bg-card p-8 text-center text-muted-foreground">No dishes yet.</p> : (
        <ul className="mt-6 grid gap-3">
          {shown.map((i) => (
            <li key={i.id} className="flex items-center gap-4 rounded-2xl bg-card p-3">
              <img src={i.imageUrl} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1"><p className="truncate font-semibold">{i.name}</p><p className="text-sm text-muted-foreground">{cat[i.categoryId] ?? "No category"} · {rupees(i.price)}{i.isFeatured ? " · Special" : ""}</p></div>
              <label className="hidden items-center gap-2 text-xs sm:flex">{i.isAvailable ? "Available" : "Sold out"}<Switch checked={i.isAvailable} aria-label={`${i.name} available`} onCheckedChange={(c) => updateItem(i.id, { isAvailable: c }).catch((e) => toast.error(firebaseErrorMessage(e)))} /></label>
              <Button size="icon" variant="ghost" aria-label={`Edit ${i.name}`} onClick={() => edit(i)}><Pencil /></Button>
              <Button size="icon" variant="ghost" aria-label={`Delete ${i.name}`} onClick={() => setDel(i)}><Trash2 className="text-destructive" /></Button>
            </li>
          ))}
        </ul>
      )}
      <AlertDialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete "{del?.name}"?</AlertDialogTitle><AlertDialogDescription>This removes the dish and its uploaded photo from the website. This can't be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel disabled={busy}>Keep it</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={busy} onClick={async (e) => { e.preventDefault(); if (!del) return; setBusy(true); try { await removeItem(del, items); toast.success("Dish deleted"); setDel(null); } catch (x) { toast.error(firebaseErrorMessage(x)); } finally { setBusy(false); } }}>{busy && <Loader2 className="animate-spin" />}Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Categories({ items, categories }: { items: FoodItem[]; categories: Category[] }) {
  const [form, setForm] = useState<{ id?: string; name: string; description: string; sortOrder: number } | null>(null);
  const [del, setDel] = useState<Category | null>(null); const [moveTo, setMoveTo] = useState(""); const [busy, setBusy] = useState(false);
  const count = del ? itemsInCategory(items, del.id) : 0;

  async function save(e: FormEvent) {
    e.preventDefault(); if (!form) return;
    if (form.name.trim().length < 2) { toast.error("Category name is too short."); return; }
    if (categories.some((c) => c.id !== form.id && c.name.toLowerCase() === form.name.trim().toLowerCase())) { toast.error("A category with that name already exists."); return; }
    setBusy(true);
    try { await saveCategory({ ...form, name: form.name.trim() }); toast.success("Category saved"); setForm(null); } catch (x) { toast.error(firebaseErrorMessage(x)); } finally { setBusy(false); }
  }

  return (
    <div>
      <div className="flex items-center justify-between"><h1 className="text-3xl font-semibold">Categories</h1><Button onClick={() => setForm({ name: "", description: "", sortOrder: categories.length + 1 })}><Plus />Add category</Button></div>
      <ul className="mt-6 grid gap-3">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center gap-4 rounded-2xl bg-card p-4">
            <div className="flex-1"><p className="font-semibold">{c.name}</p><p className="text-sm text-muted-foreground">{itemsInCategory(items, c.id)} dishes · order {c.sortOrder}</p></div>
            <Button size="icon" variant="ghost" aria-label={`Edit ${c.name}`} onClick={() => setForm({ ...c })}><Pencil /></Button>
            <Button size="icon" variant="ghost" aria-label={`Delete ${c.name}`} onClick={() => { setDel(c); setMoveTo(""); }}><Trash2 className="text-destructive" /></Button>
          </li>
        ))}
      </ul>
      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent><DialogHeader><DialogTitle>{form?.id ? "Edit category" : "New category"}</DialogTitle></DialogHeader>
          {form && <form onSubmit={save} className="space-y-4">
            <div className="space-y-1.5"><Label htmlFor="cn">Name</Label><Input id="cn" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-1.5"><Label htmlFor="cd">Description</Label><Input id="cd" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="space-y-1.5"><Label htmlFor="co">Display order</Label><Input id="co" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} /></div>
            <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setForm(null)}>Cancel</Button><Button type="submit" disabled={busy}>{busy && <Loader2 className="animate-spin" />}Save</Button></div>
          </form>}
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete "{del?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>{count ? `${count} dishes are in this category. Choose where to move them first.` : "This category is empty and can be deleted safely."}</AlertDialogDescription></AlertDialogHeader>
          {count > 0 && <select aria-label="Move dishes to" value={moveTo} onChange={(e) => setMoveTo(e.target.value)} className="h-9 rounded-md border border-input bg-card px-3 text-sm"><option value="">Move dishes to…</option>{categories.filter((c) => c.id !== del?.id).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>}
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={busy || (count > 0 && !moveTo)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={async (e) => { e.preventDefault(); if (!del) return; setBusy(true); try { await deleteCategory(del.id, items, moveTo || null); toast.success("Category deleted"); setDel(null); } catch (x) { toast.error(firebaseErrorMessage(x)); } finally { setBusy(false); } }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
