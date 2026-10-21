// DEMO DATA — dishes and prices are placeholders until the owner confirms the real menu.
import type { Category, FoodItem } from "./menu-types";
const breakfast = "/images/menu/breakfast.jpg";
const poori = "/images/menu/poori-pongal.jpg";
const thali = "/images/menu/hero-thali.jpg";
const rice = "/images/menu/rice.jpg";
const dinner = "/images/menu/dinner.jpg";
const snacks = "/images/menu/snacks.jpg";
const drinks = "/images/menu/beverages.jpg";

export const DEMO_CATEGORIES: Category[] = [
  { id: "breakfast", name: "Breakfast", description: "Morning tiffin", sortOrder: 1 },
  { id: "lunch", name: "Lunch", description: "Meals & rice", sortOrder: 2 },
  { id: "dinner", name: "Dinner", description: "Light evening meals", sortOrder: 3 },
  { id: "snacks", name: "Snacks", description: "Tea-time bites", sortOrder: 4 },
  { id: "beverages", name: "Beverages", description: "Hot & cool drinks", sortOrder: 5 },
  { id: "combos", name: "Combos", description: "Value combos & family meals", sortOrder: 6 },
];

type Seed = [id: string, name: string, desc: string, price: number, cat: string, img: string, featured?: boolean, jain?: boolean, available?: boolean];

const S: Seed[] = [
  ["idli", "Idli (2 pcs)", "Soft steamed rice-lentil idlis with coconut chutney and sambar.", 40, "breakfast", breakfast, true],
  ["plain-dosa", "Plain Dosa", "Thin, golden dosa with chutney and sambar.", 50, "breakfast", breakfast],
  ["masala-dosa", "Masala Dosa", "Crisp dosa filled with spiced potato palya.", 70, "breakfast", breakfast, true],
  ["ven-pongal", "Ven Pongal", "Rice and moong dal cooked with ghee, pepper and cumin.", 60, "breakfast", poori],
  ["poori-sagu", "Poori Sagu", "Three fluffy pooris with potato sagu.", 65, "breakfast", poori],
  ["rava-upma", "Rava Upma", "Semolina upma tempered with mustard, curry leaves and veggies.", 45, "breakfast", poori],
  ["medu-vada", "Medu Vada (2 pcs)", "Crispy urad dal vadas with chutney.", 45, "breakfast", snacks],
  ["chapati-breakfast", "Chapati & Palya", "Two soft chapatis with a seasonal vegetable palya.", 55, "breakfast", dinner],
  ["south-meals", "South Indian Full Meals", "Rice, sambar, rasam, two palyas, kosambari, curd, pickle and chapati.", 140, "lunch", thali, true],
  ["mini-meals", "Mini Meals", "Smaller plate: rice, sambar, one palya, curd and pickle.", 95, "lunch", thali],
  ["jain-meals", "Jain Meals", "Full meal made without onion, garlic or root vegetables.", 150, "lunch", thali, true, true],
  ["lemon-rice", "Lemon Rice", "Tangy chitranna with peanuts and curry leaves.", 60, "lunch", rice],
  ["tomato-rice", "Tomato Rice", "Rice cooked in a spiced tomato masala.", 65, "lunch", rice],
  ["curd-rice", "Curd Rice", "Cooling curd rice with mustard tempering and pomegranate.", 55, "lunch", rice],
  ["bisibele", "Bisi Bele Bath", "Karnataka-style spiced rice, lentils and vegetables.", 75, "lunch", rice, true],
  ["veg-biryani", "Veg Biryani", "Fragrant rice layered with vegetables and whole spices, with raita.", 110, "lunch", rice, false, false, false],
  ["phulka-kurma", "Phulka & Veg Kurma", "Three phulkas with a mild coconut vegetable kurma.", 80, "dinner", dinner, true],
  ["parotta", "Parotta & Salna", "Two layered parottas with vegetable salna.", 85, "dinner", dinner],
  ["set-dosa", "Set Dosa", "Three spongy set dosas with sagu and chutney.", 65, "dinner", breakfast],
  ["onion-uthappam", "Vegetable Uthappam", "Thick uthappam topped with vegetables.", 70, "dinner", breakfast],
  ["idiyappam", "Idiyappam & Stew", "Rice string hoppers with a light coconut vegetable stew.", 80, "dinner", poori],
  ["veg-pulao", "Veg Pulao", "Mildly spiced rice with peas, carrots and beans.", 85, "dinner", rice],
  ["dal-khichdi", "Dal Khichdi", "Comforting rice and dal with ghee — easy on the stomach.", 70, "dinner", poori, false, true],
  ["samosa", "Samosa (2 pcs)", "Crisp pastry filled with spiced potato and peas.", 30, "snacks", snacks],
  ["mirchi-bajji", "Mirchi Bajji", "Chilli fritters in gram-flour batter.", 35, "snacks", snacks],
  ["onion-pakoda", "Onion Pakoda", "Crunchy onion fritters.", 40, "snacks", snacks],
  ["mysore-bonda", "Mysore Bonda", "Fluffy fried dumplings with chutney.", 40, "snacks", snacks],
  ["sundal", "Chana Sundal", "Chickpeas tempered with coconut and curry leaves.", 35, "snacks", rice, false, true],
  ["filter-coffee", "Filter Coffee", "Strong South Indian filter coffee.", 25, "beverages", drinks, true],
  ["masala-tea", "Masala Tea", "Tea brewed with ginger and cardamom.", 20, "beverages", drinks],
  ["buttermilk", "Masala Buttermilk", "Spiced majjige with coriander and ginger.", 25, "beverages", drinks],
  ["fresh-juice", "Fresh Seasonal Juice", "Freshly pressed fruit juice of the day.", 50, "beverages", drinks],
  ["bf-combo", "Breakfast Combo", "2 idli + 1 vada + filter coffee.", 95, "combos", breakfast, true],
  ["lunch-combo", "Lunch Combo", "Variety rice + curd rice + buttermilk.", 120, "combos", rice],
  ["dinner-combo", "Dinner Combo", "3 phulkas, kurma, dal khichdi.", 130, "combos", dinner],
  ["family-meal", "Family Meal (serves 4)", "4 full meals with sweet of the day.", 520, "combos", thali],
];

export const DEMO_ITEMS: FoodItem[] = S.map(([id, name, description, price, categoryId, imageUrl, f, j, a]) => ({
  id, name, description, price, categoryId, imageUrl, imagePath: "",
  isFeatured: !!f, foodType: j ? "jain" : "veg", isAvailable: a !== false, preparationTime: null,
}));
