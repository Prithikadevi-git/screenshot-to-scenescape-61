export type FoodType = "veg" | "jain";

export interface Category {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  imagePath: string; // Firebase Storage path; empty for bundled demo images
  isAvailable: boolean;
  isFeatured: boolean;
  foodType: FoodType;
  preparationTime: number | null;
}

export type ItemInput = Omit<FoodItem, "id">;

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateItem(i: Partial<ItemInput>): Record<string, string> {
  const e: Record<string, string> = {};
  if (!i.name || i.name.trim().length < 2) e["name"] = "Name must be at least 2 characters.";
  if (i.name && i.name.length > 80) e["name"] = "Name is too long (max 80).";
  if (!i.description || i.description.trim().length < 5) e["description"] = "Add a short description.";
  if (typeof i.price !== "number" || !Number.isFinite(i.price) || i.price <= 0) e["price"] = "Price must be more than ₹0.";
  else if (i.price > 100000) e["price"] = "Price looks too high.";
  if (!i.categoryId) e["categoryId"] = "Choose a category.";
  if (i.preparationTime != null && (i.preparationTime < 0 || i.preparationTime > 600)) e["preparationTime"] = "Enter 0–600 minutes.";
  return e;
}

export function validateImage(file: { type: string; size: number }): string | null {
  if (!IMAGE_TYPES.includes(file.type)) return "Only JPG, PNG or WebP images are allowed.";
  if (file.size > MAX_IMAGE_BYTES) return "Image must be 5 MB or smaller.";
  return null;
}

export function itemsInCategory(items: Pick<FoodItem, "categoryId">[], categoryId: string): number {
  return items.filter((i) => i.categoryId === categoryId).length;
}

export type SortKey = "featured" | "price-asc" | "price-desc" | "name";

export function filterSortItems<T extends Pick<FoodItem, "name" | "description" | "categoryId" | "price" | "isFeatured" | "isAvailable">>(
  items: T[], opts: { categoryId: string | "all"; query: string; sort: SortKey },
): T[] {
  const q = opts.query.trim().toLowerCase();
  const out = items.filter((i) => (opts.categoryId === "all" || i.categoryId === opts.categoryId) && (!q || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)));
  const avail = (a: T, b: T) => Number(b.isAvailable) - Number(a.isAvailable);
  const cmp: Record<SortKey, (a: T, b: T) => number> = {
    featured: (a, b) => avail(a, b) || Number(b.isFeatured) - Number(a.isFeatured) || a.name.localeCompare(b.name),
    "price-asc": (a, b) => avail(a, b) || a.price - b.price,
    "price-desc": (a, b) => avail(a, b) || b.price - a.price,
    name: (a, b) => a.name.localeCompare(b.name),
  };
  return [...out].sort(cmp[opts.sort]);
}

export const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;
