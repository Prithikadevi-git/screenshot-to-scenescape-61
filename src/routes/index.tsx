import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Menu as MenuIcon, X, Phone, MessageCircle, Leaf, Home, Truck, CalendarCheck, Sprout, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EnquiryForm } from "@/components/EnquiryForm";
import { KITCHEN, whatsappLink } from "@/lib/kitchen";
import { PublicMenu } from "@/components/PublicMenu";
import hero from "@/assets/hero-thali.jpg";
import dinner from "@/assets/dinner.jpg";
import kitchenImg from "@/assets/kitchen.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shaiva's Swayampaaka — Pure Veg Home Food, Varthur" },
      { name: "description", content: "Home-cooked pure vegetarian breakfast, lunch & dinner delivered across Varthur, Whitefield & ITPL. Monthly subscriptions and Jain options." },
      { property: "og:title", content: "Shaiva's Swayampaaka — Pure Veg Home Food, Varthur" },
      { property: "og:description", content: "Home-cooked vegetarian meals delivered to your door. Try a day, then subscribe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV: [string, string][] = [["Menu", "#menu"], ["Meal plans", "#plans"], ["About", "#about"], ["Delivery", "#delivery"], ["FAQ", "#faq"], ["Contact", "#contact"]];
const GENERAL = whatsappLink(`Hello ${KITCHEN.name}! I'd like to know today's menu and prices.`);

function Index() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <PublicMenu />
      <Plans />
      <About />
      <Why />
      <Delivery />
      <Bulk />
      <Faq />
      <Contact />
      <Footer />
      <a href={GENERAL} target="_blank" rel="noopener" aria-label="Order on WhatsApp" className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-warm transition hover:scale-105">
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-accent-foreground"><Leaf className="h-5 w-5" /></span>
      <span className="font-display text-lg font-semibold leading-none">Shaiva's<br /><span className="text-sm font-medium tracking-wide opacity-80">Swayampaaka</span></span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          {NAV.map(([l, h]) => <a key={h} href={h} className="hover:text-primary">{l}</a>)}
        </nav>
        <div className="hidden md:block"><Button asChild variant="whatsapp" size="sm" className="px-4"><a href={GENERAL} target="_blank" rel="noopener"><MessageCircle />Order</a></Button></div>
        <button className="md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <MenuIcon />}</button>
      </div>
      {open && (
        <nav className="border-t border-border bg-background px-5 py-4 md:hidden">
          {NAV.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)} className="block py-2.5 text-lg font-display">{l}</a>)}
          <Button asChild variant="whatsapp" className="mt-3 w-full"><a href={GENERAL} target="_blank" rel="noopener">Order on WhatsApp</a></Button>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-leaf-deep text-leaf-deep-foreground">
      <img src={hero} alt="A South Indian vegetarian meal on banana leaf" width={1600} height={1104} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-hero-fade" />
      <div className="relative mx-auto max-w-6xl px-5 py-24 md:py-36">
        <div className="max-w-xl animate-rise">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-accent">Pure vegetarian · Varthur, Bengaluru</p>
          <h1 className="text-5xl font-semibold leading-[1.05] md:text-7xl">The warmth of home, in every tiffin.</h1>
          <p className="mt-6 text-lg opacity-90">Simple, home-cooked breakfast, lunch and dinner — made to your preferences and delivered to your home or workplace.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg"><a href="#menu">Explore our menu</a></Button>
            <Button asChild variant="heroOutline" size="lg"><a href="#plans">Enquire about meal plans</a></Button>
          </div>
          <p className="mt-6 text-sm opacity-80">New here? Try our meals for a day or two before you subscribe.</p>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-semibold md:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-muted-foreground">{sub}</p>}
    </div>
  );
}

function Plans() {
  const plans: [string, string, string][] = [
    ["Trial", "1–2 days", "Taste our food before you commit — exactly how many of our regulars started."],
    ["Weekly", "7 days", "Breakfast, lunch, dinner or any mix, for busy work weeks."],
    ["Monthly", "30 days", "Our subscription plan for steady, worry-free home food every day."],
  ];
  return (
    <section id="plans" className="bg-secondary py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead eyebrow="Meal subscriptions" title="Never think about 'what to eat' again" sub="Tell us your meals, spice level and preferences. Jain options available." />
        <div className="mb-14 grid gap-5 md:grid-cols-3">
          {plans.map(([t, d, b], i) => (
            <div key={t} className={`rounded-3xl p-8 ${i === 2 ? "bg-leaf-deep text-leaf-deep-foreground shadow-warm" : "bg-card"}`}>
              <p className="text-sm opacity-70">{d}</p>
              <h3 className="mt-1 text-3xl font-semibold">{t}</h3>
              <p className="mt-3 text-sm opacity-80">{b}</p>
            </div>
          ))}
        </div>
        <div className="mx-auto max-w-3xl rounded-3xl bg-card p-6 shadow-warm md:p-10">
          <h3 className="mb-6 text-2xl font-semibold">Enquire about a meal plan</h3>
          <EnquiryForm kind="subscription" />
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-24 md:grid-cols-2">
      <img src={kitchenImg} alt="Tempering mustard seeds and curry leaves" loading="lazy" width={1024} height={1280} className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-warm" />
      <div>
        <p className="eyebrow">Our kitchen</p>
        <h2 className="mt-3 text-4xl font-semibold md:text-5xl">Swayampaaka — <em className="text-primary">cooked by one's own hands</em></h2>
        <p className="mt-6 text-lg text-muted-foreground">Shaiva's Swayampaaka is a pure vegetarian home-style kitchen in Varthur, run by {KITCHEN.owner}. We cook simple, everyday food the way it's made at home — and prepare it keeping each person's own food preferences in mind.</p>
        <p className="mt-4 text-muted-foreground">For students, working professionals and families in and around Whitefield who miss the comfort of a home-cooked plate.</p>
      </div>
    </section>
  );
}

function Why() {
  const pts = [
    [Sprout, "100% vegetarian", "A pure vegetarian kitchen, with Jain options."],
    [Home, "Home-style cooking", "Simple everyday food, not restaurant food."],
    [CalendarCheck, "Made your way", "Tell us your preferences — we cook around them."],
    [Truck, "Home or office delivery", "Delivered to your doorstep or workplace."],
  ] as const;
  return (
    <section className="bg-leaf-deep py-20 text-leaf-deep-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:grid-cols-2 lg:grid-cols-4">
        {pts.map(([Icon, t, b]) => (
          <div key={t}><Icon className="h-8 w-8 text-accent" /><h3 className="mt-4 text-xl font-semibold">{t}</h3><p className="mt-2 text-sm opacity-80">{b}</p></div>
        ))}
      </div>
    </section>
  );
}

function Delivery() {
  return (
    <section id="delivery" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHead eyebrow="Where we deliver" title="In and around Varthur" sub="Not on the list? Message us — we may still reach you." />
      <div className="flex flex-wrap justify-center gap-3">
        {KITCHEN.areas.map((a) => <span key={a} className="flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 font-medium"><MapPin className="h-4 w-4 text-chili" />{a}</span>)}
        <span className="rounded-full border border-dashed border-border px-5 py-3 text-muted-foreground">& nearby areas</span>
      </div>
    </section>
  );
}

function Bulk() {
  return (
    <section className="bg-secondary py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-2">
        <div>
          <p className="eyebrow">Groups & gatherings</p>
          <h2 className="mt-3 text-4xl font-semibold">Feeding a team or a family function?</h2>
          <p className="mt-4 text-muted-foreground">Share the headcount and date, and we'll get back to you on what we can prepare.</p>
          <img src={dinner} alt="Chapatis and curry in a steel tiffin" loading="lazy" width={1024} height={1024} className="mt-8 hidden aspect-[4/3] w-full rounded-3xl object-cover md:block" />
        </div>
        <div className="rounded-3xl bg-card p-6 shadow-warm md:p-10"><EnquiryForm kind="bulk" /></div>
      </div>
    </section>
  );
}

function Faq() {
  const qs: [string, string][] = [
    ["Is the food fully vegetarian?", "Yes. We are a pure vegetarian cloud kitchen. Jain options are also available."],
    ["Which meals do you serve?", "Breakfast, lunch and dinner."],
    ["Can I try before subscribing?", "Yes — you can try our meals for a day or two, then decide on a subscription."],
    ["Do you deliver to offices?", "Yes, we deliver to your home or your workplace, whichever you prefer."],
    ["Which areas do you cover?", `${KITCHEN.areas.join(", ")} and many nearby areas.`],
    ["How do I order?", "Message or call us on " + KITCHEN.phoneDisplay + ", or tap any 'Order on WhatsApp' button on this page."],
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-24">
      <SectionHead eyebrow="Good to know" title="Questions, answered" />
      <Accordion type="single" collapsible>
        {qs.map(([q, a]) => (
          <AccordionItem key={q} value={q}><AccordionTrigger className="text-left font-display text-lg">{q}</AccordionTrigger><AccordionContent className="text-muted-foreground">{a}</AccordionContent></AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="px-5 pb-24">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-leaf-deep px-8 py-16 text-center text-leaf-deep-foreground md:px-16">
        <h2 className="text-4xl font-semibold md:text-5xl">Hungry for home food?</h2>
        <p className="mx-auto mt-4 max-w-lg opacity-85">Call or WhatsApp {KITCHEN.owner} at Shaiva's Swayampaaka, {KITCHEN.locality}.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="whatsapp" size="lg"><a href={GENERAL} target="_blank" rel="noopener"><MessageCircle />Order on WhatsApp</a></Button>
          <Button asChild variant="heroOutline" size="lg"><a href={`tel:+${KITCHEN.phoneE164}`}><Phone />{KITCHEN.phoneDisplay}</a></Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <Logo />
        <nav className="flex flex-wrap gap-5 text-sm text-muted-foreground">{NAV.map(([l, h]) => <a key={h} href={h} className="hover:text-foreground">{l}</a>)}</nav>
        <p className="text-sm text-muted-foreground">{KITCHEN.locality} · {KITCHEN.phoneDisplay}</p>
      </div>
      <p className="pb-6 text-center text-xs text-muted-foreground">Website concept · Menu & prices shown are samples until confirmed by the kitchen. · <a href="/admin" className="underline">Staff login</a></p>
    </footer>
  );
}
