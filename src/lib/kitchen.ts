// Verified from the owner's public posts (Reddit, Aug–Sep 2026). Anything else is marked "to confirm".
export const KITCHEN = {
  name: "Shaiva's Swayampaaka",
  owner: "Renuka Mahesh",
  locality: "Varthur, Bengaluru",
  phoneDisplay: "+91 81975 93457",
  phoneE164: "918197593457",
  areas: ["Varthur", "Whitefield", "ITPL", "Kadugodi", "Pattandur Agrahara", "Nallurhalli"],
};

export function whatsappLink(message: string): string {
  return `https://wa.me/${KITCHEN.phoneE164}?text=${encodeURIComponent(message)}`;
}

export function orderMessage(item: { name: string; category: string }, qty: number): string {
  const q = Math.max(1, Math.floor(qty));
  return `Hello ${KITCHEN.name}! I'd like to order ${q} × ${item.name} (${item.category}). Please share today's menu, price and delivery time.`;
}
