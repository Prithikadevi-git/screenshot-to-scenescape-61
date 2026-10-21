<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Business facts (phone, areas, owner) live only in src/lib/kitchen.ts; never add unverified facts — illustrative content must be labelled as such.
- Enquiry forms hand off to WhatsApp (no backend); do not claim server-side submission.
- Menu, categories and admin use Firebase (Auth, Firestore, Storage) via src/lib/firebase.ts with VITE_FIREBASE_* web config; admin rights = doc in `admins/{uid}`, enforced by firestore.rules/storage.rules (keep rules in sync with data shape).
- Without Firebase config the public menu falls back to labelled demo data (src/lib/demo-menu.ts); demo images live in public/images/menu so seeded URLs stay stable.
