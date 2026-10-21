// Verified from the owner's public posts (Reddit, Aug–Sep 2026). Anything else is marked "to confirm".
export const KITCHEN = {
  name: "Shaiva's Swayampaaka",
  owner: "Renuka Mahesh",
  locality: "Varthur, Bengaluru",
  phoneDisplay: "+91 81975 93457",
  phoneE164: "918197593457",
  areas: ["Varthur", "Whitefield", "ITPL", "Kadugodi", "Pattandur Agrahara", "Nallurhalli"],
};

export type MealCategory = "Breakfast" | "Lunch" | "Dinner" | "Jain";

export interface MenuItem {
  id: string;
  name: string;
  category: MealCategory;
  description: string;
}

// Illustrative dishes for the proposal — the real daily menu and prices must come from the kitchen.
export const MENU: MenuItem[] = [
  { id: "b1", name: "Idli, Chutney & Sambar", category: "Breakfast", description: "Soft steamed idlis with fresh coconut chutney and sambar." },
  { id: "b2", name: "Dosa of the Day", category: "Breakfast", description: "A home-style dosa served with chutney and sambar." },
  { id: "b3", name: "Upma / Avalakki", category: "Breakfast", description: "Light, comforting morning staples with curry-leaf tempering." },
  { id: "l1", name: "Home-style Meals", category: "Lunch", description: "Rice, sambar, rasam, palya and curd — a simple, filling plate." },
  { id: "l2", name: "Chapati Meal", category: "Lunch", description: "Soft chapatis with a vegetable curry, dal and rice." },
  { id: "l3", name: "Variety Rice", category: "Lunch", description: "A rotating rice dish with a side, ideal for office lunch boxes." },
  { id: "d1", name: "Chapati & Kurma", category: "Dinner", description: "Light phulkas with a gentle vegetable kurma." },
  { id: "d2", name: "Dinner Thali", category: "Dinner", description: "Chapati, dal, sabzi and rice for a complete evening meal." },
  { id: "j1", name: "Jain Meal", category: "Jain", description: "Prepared without onion, garlic or root vegetables, on request." },
];

export const CATEGORIES: ("All" | MealCategory)[] = ["All", "Breakfast", "Lunch", "Dinner", "Jain"];

export function whatsappLink(message: string): string {
  return `https://wa.me/${KITCHEN.phoneE164}?text=${encodeURIComponent(message)}`;
}

export function orderMessage(item: Pick<MenuItem, "name" | "category">, qty: number): string {
  const q = Math.max(1, Math.floor(qty));
  return `Hello ${KITCHEN.name}! I'd like to order ${q} × ${item.name} (${item.category}). Please share today's menu, price and delivery time.`;
}
