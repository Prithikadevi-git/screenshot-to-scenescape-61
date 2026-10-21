import { describe, it, expect } from "vitest";
import { filterSortItems, itemsInCategory, validateImage, validateItem } from "@/lib/menu-types";
import { DEMO_ITEMS, DEMO_CATEGORIES } from "@/lib/demo-menu";

const ok = { name: "Idli", description: "Soft idlis", price: 40, categoryId: "breakfast", preparationTime: null };

describe("menu rules", () => {
  it("rejects a price of ₹0", () => expect(validateItem({ ...ok, price: 0 })["price"]).toBeTruthy());
  it("accepts a valid dish", () => expect(validateItem(ok)).toEqual({}));
  it("requires a category", () => expect(validateItem({ ...ok, categoryId: "" })["categoryId"]).toBeTruthy());
  it("allows JPG, PNG and WebP only", () => {
    expect(validateImage({ type: "image/webp", size: 1000 })).toBeNull();
    expect(validateImage({ type: "image/gif", size: 1000 })).not.toBeNull();
  });
  it("rejects images over 5 MB", () => expect(validateImage({ type: "image/jpeg", size: 5 * 1024 * 1024 + 1 })).not.toBeNull());
  it("counts dishes blocking a category delete", () => expect(itemsInCategory([{ categoryId: "a" }, { categoryId: "a" }, { categoryId: "b" }], "a")).toBe(2));
  it("lists sold-out dishes after available ones", () => {
    const r = filterSortItems(DEMO_ITEMS, { categoryId: "lunch", query: "", sort: "price-desc" });
    expect(r[r.length - 1]!.isAvailable).toBe(false);
  });
  it("search matches dish names", () => expect(filterSortItems(DEMO_ITEMS, { categoryId: "all", query: "dosa", sort: "name" }).every((i) => /dosa/i.test(i.name + i.description))).toBe(true));
  it("demo menu has every category with several unique dishes", () => {
    for (const c of DEMO_CATEGORIES) expect(DEMO_ITEMS.filter((i) => i.categoryId === c.id).length).toBeGreaterThanOrEqual(4);
    expect(new Set(DEMO_ITEMS.map((i) => i.name)).size).toBe(DEMO_ITEMS.length);
  });
});
