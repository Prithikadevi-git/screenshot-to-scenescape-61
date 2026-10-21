import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { validateImage, validateItem, IMAGE_TYPES, type Category, type FoodItem, type ItemInput } from "@/lib/menu-types";
import { createItem, deleteImageIfUnused, updateItem, uploadImage } from "@/lib/admin-api";
import { firebaseErrorMessage } from "@/lib/firebase";

export function ItemForm({ item, categories, items, onDone }: { item: FoodItem | null; categories: Category[]; items: FoodItem[]; onDone: () => void }) {
  const [v, setV] = useState<ItemInput>(item ? { ...item } : {
    name: "", description: "", price: 0, categoryId: categories[0]?.id ?? "", imageUrl: "", imagePath: "",
    isAvailable: true, isFeatured: false, foodType: "veg", preparationTime: null,
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(item?.imageUrl ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof ItemInput>(k: K, val: ItemInput[K]) => setV((p) => ({ ...p, [k]: val }));

  function pick(f: File | undefined) {
    if (!f) return;
    const err = validateImage(f);
    if (err) { setErrors((e) => ({ ...e, image: err })); return; }
    setErrors(({ image: _i, ...rest }) => rest);
    setFile(f); setPreview(URL.createObjectURL(f));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const errs = validateItem(v);
    if (!file && !v.imageUrl) errs["image"] = "Add a photo of the dish.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    try {
      let data = { ...v, name: v.name.trim(), description: v.description.trim() };
      const oldPath = item?.imagePath ?? "";
      if (file) {
        setProgress(0);
        const up = await uploadImage(file, setProgress);
        data = { ...data, imageUrl: up.url, imagePath: up.path };
      }
      if (item) await updateItem(item.id, data); else await createItem(data);
      if (file && oldPath && oldPath !== data.imagePath) await deleteImageIfUnused(oldPath, items, item?.id).catch(() => toast.warning("Saved, but the old photo couldn't be removed."));
      toast.success(item ? "Dish updated" : "Dish added");
      onDone();
    } catch (err) {
      toast.error(firebaseErrorMessage(err));
    } finally { setSaving(false); setProgress(null); }
  }

  const err = (k: string) => errors[k] && <p className="text-sm text-destructive">{errors[k]}</p>;

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Label htmlFor="img">Photo (JPG, PNG or WebP, up to 5 MB)</Label>
        <label htmlFor="img" className="mt-1.5 flex aspect-[16/9] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted hover:border-primary">
          {preview ? <img src={preview} alt="Preview" className="h-full w-full object-cover" /> : <span className="flex flex-col items-center gap-2 text-sm text-muted-foreground"><ImagePlus className="h-8 w-8" />Tap to upload a photo</span>}
        </label>
        <input id="img" type="file" accept={IMAGE_TYPES.join(",")} className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
        {preview && <p className="mt-1 text-xs text-muted-foreground">Tap the photo to replace it.</p>}
        {err("image")}
        {progress !== null && <div className="mt-2"><Progress value={progress} /><p className="mt-1 text-xs">Uploading… {progress}%</p></div>}
      </div>
      <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="name">Dish name</Label><Input id="name" value={v.name} onChange={(e) => set("name", e.target.value)} />{err("name")}</div>
      <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="desc">Description</Label><Textarea id="desc" rows={2} value={v.description} onChange={(e) => set("description", e.target.value)} />{err("description")}</div>
      <div className="space-y-1.5"><Label htmlFor="price">Price (₹)</Label><Input id="price" type="number" min={1} inputMode="decimal" value={v.price || ""} onChange={(e) => set("price", Number(e.target.value))} />{err("price")}</div>
      <div className="space-y-1.5"><Label htmlFor="cat">Category</Label>
        <select id="cat" value={v.categoryId} onChange={(e) => set("categoryId", e.target.value)} className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm">
          <option value="">Choose…</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>{err("categoryId")}</div>
      <div className="space-y-1.5"><Label htmlFor="type">Food type</Label>
        <select id="type" value={v.foodType} onChange={(e) => set("foodType", e.target.value as ItemInput["foodType"])} className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm">
          <option value="veg">Vegetarian</option><option value="jain">Jain (no onion/garlic)</option>
        </select></div>
      <div className="space-y-1.5"><Label htmlFor="prep">Prep time in minutes (optional)</Label><Input id="prep" type="number" min={0} value={v.preparationTime ?? ""} onChange={(e) => set("preparationTime", e.target.value === "" ? null : Number(e.target.value))} />{err("preparationTime")}</div>
      <label className="flex items-center justify-between rounded-xl border border-border p-3 text-sm"><span>Available to order</span><Switch checked={v.isAvailable} onCheckedChange={(c) => set("isAvailable", c)} /></label>
      <label className="flex items-center justify-between rounded-xl border border-border p-3 text-sm"><span>Show as today's special</span><Switch checked={v.isFeatured} onCheckedChange={(c) => set("isFeatured", c)} /></label>
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="outline" onClick={onDone} disabled={saving}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving && <Loader2 className="animate-spin" />}{item ? "Save changes" : "Add dish"}</Button>
      </div>
    </form>
  );
}
