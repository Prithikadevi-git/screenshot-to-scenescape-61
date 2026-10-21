import { describe, it, expect } from "vitest";
import { orderMessage, whatsappLink } from "@/lib/kitchen";

describe("WhatsApp ordering", () => {
  it("sends to the kitchen's number 8197593457", () => {
    expect(whatsappLink("hi")).toBe("https://wa.me/918197593457?text=hi");
  });
  it("includes item and quantity in the message", () => {
    expect(orderMessage({ name: "Jain Meal", category: "Jain" }, 3)).toContain("3 × Jain Meal (Jain)");
  });
  it("never sends a quantity below 1", () => {
    expect(orderMessage({ name: "Dosa", category: "Breakfast" }, 0)).toContain("1 × Dosa");
  });
});
