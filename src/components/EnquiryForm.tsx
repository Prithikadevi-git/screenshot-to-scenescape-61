import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { KITCHEN, whatsappLink } from "@/lib/kitchen";
import { CheckCircle2 } from "lucide-react";

type Kind = "subscription" | "bulk";

export function EnquiryForm({ kind }: { kind: Kind }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    const errs: Record<string, string> = {};
    if (v("name").length < 2) errs["name"] = "Please enter your name.";
    if (!/^[6-9]\d{9}$/.test(v("phone").replace(/\D/g, "").slice(-10))) errs["phone"] = "Enter a valid 10-digit mobile number.";
    if (!v("area")) errs["area"] = "Tell us where to deliver.";
    if (kind === "bulk" && !(Number(v("people")) > 0)) errs["people"] = "How many people?";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const lines =
      kind === "subscription"
        ? [`Hello ${KITCHEN.name}, I'd like a meal subscription.`, `Name: ${v("name")}`, `Phone: ${v("phone")}`, `Area: ${v("area")}`, `Plan: ${v("plan")}`, `Meals: ${f.getAll("meals").join(", ") || "Not sure yet"}`, `Jain: ${f.get("jain") ? "Yes" : "No"}`, v("notes") && `Notes: ${v("notes")}`]
        : [`Hello ${KITCHEN.name}, I have a bulk / group order enquiry.`, `Name: ${v("name")}`, `Phone: ${v("phone")}`, `Area: ${v("area")}`, `People: ${v("people")}`, `Date: ${v("date") || "Flexible"}`, v("notes") && `Details: ${v("notes")}`];
    window.open(whatsappLink(lines.filter(Boolean).join("\n")), "_blank", "noopener");
    setSent(true);
  }

  if (sent)
    return (
      <div role="status" className="flex flex-col items-center gap-3 rounded-2xl bg-secondary p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-primary" />
        <p className="font-display text-xl">Your enquiry is ready in WhatsApp</p>
        <p className="text-sm text-muted-foreground">Press send in WhatsApp to reach the kitchen. If it didn't open, call {KITCHEN.phoneDisplay}.</p>
        <Button variant="outline" onClick={() => setSent(false)}>Send another</Button>
      </div>
    );

  const field = (id: string, label: string, el: React.ReactNode) => (
    <div className="space-y-1.5">
      <Label htmlFor={`${kind}-${id}`}>{label}</Label>
      {el}
      {errors[id] && <p className="text-sm text-destructive">{errors[id]}</p>}
    </div>
  );

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      {field("name", "Your name", <Input id={`${kind}-name`} name="name" autoComplete="name" aria-invalid={!!errors["name"]} />)}
      {field("phone", "Mobile number", <Input id={`${kind}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" aria-invalid={!!errors["phone"]} />)}
      {field("area", "Delivery area", <Input id={`${kind}-area`} name="area" placeholder="e.g. Whitefield, ITPL" aria-invalid={!!errors["area"]} />)}
      {kind === "subscription" ? (
        <>
          {field("plan", "Plan", (
            <select id={`${kind}-plan`} name="plan" className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm">
              <option>Trial (1–2 days)</option><option>Weekly</option><option>Monthly</option>
            </select>
          ))}
          <fieldset className="sm:col-span-2">
            <legend className="mb-2 text-sm font-medium">Which meals?</legend>
            <div className="flex flex-wrap gap-3">
              {["Breakfast", "Lunch", "Dinner"].map((m) => (
                <label key={m} className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground">
                  <input type="checkbox" name="meals" value={m} className="sr-only" />{m}
                </label>
              ))}
              <label className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm has-[:checked]:border-accent has-[:checked]:bg-accent">
                <input type="checkbox" name="jain" className="sr-only" />Jain option
              </label>
            </div>
          </fieldset>
        </>
      ) : (
        <>
          {field("people", "Number of people", <Input id={`${kind}-people`} name="people" type="number" min={1} aria-invalid={!!errors["people"]} />)}
          {field("date", "Date (optional)", <Input id={`${kind}-date`} name="date" type="date" />)}
        </>
      )}
      <div className="sm:col-span-2">{field("notes", kind === "bulk" ? "Occasion & preferences" : "Food preferences (spice, allergies…)", <Textarea id={`${kind}-notes`} name="notes" rows={3} />)}</div>
      <div className="sm:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">Opens WhatsApp with your details filled in — nothing is stored on this site.</p>
        <Button type="submit" variant="whatsapp" size="lg">Send on WhatsApp</Button>
      </div>
    </form>
  );
}
