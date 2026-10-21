import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { fb, firebaseConfigured, firebaseErrorMessage } from "@/lib/firebase";
import { DEMO_CATEGORIES, DEMO_ITEMS } from "@/lib/demo-menu";
import type { Category, FoodItem } from "@/lib/menu-types";

export type MenuState =
  | { status: "loading"; items: FoodItem[]; categories: Category[] }
  | { status: "ready" | "demo"; items: FoodItem[]; categories: Category[] }
  | { status: "error"; error: string; items: FoodItem[]; categories: Category[] };

/** Live menu from Firestore. Falls back to labelled demo data only when Firebase isn't configured. */
export function useMenu(): MenuState {
  const [state, setState] = useState<MenuState>(
    firebaseConfigured ? { status: "loading", items: [], categories: [] } : { status: "demo", items: DEMO_ITEMS, categories: DEMO_CATEGORIES },
  );

  useEffect(() => {
    if (!firebaseConfigured) return;
    const { db } = fb();
    let items: FoodItem[] | null = null;
    let cats: Category[] | null = null;
    const push = () => items && cats && setState({ status: "ready", items, categories: cats });
    const fail = (e: unknown) => setState({ status: "error", error: firebaseErrorMessage(e), items: [], categories: [] });
    const u1 = onSnapshot(collection(db, "foodItems"), (s) => { items = s.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FoodItem, "id">) })); push(); }, fail);
    const u2 = onSnapshot(query(collection(db, "categories"), orderBy("sortOrder")), (s) => { cats = s.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Category, "id">) })); push(); }, fail);
    return () => { u1(); u2(); };
  }, []);

  return state;
}
