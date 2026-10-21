# Firebase setup — Shaiva's Swayampaaka

Until these steps are done, the website shows a clearly labelled **sample menu** and `/admin` says Firebase isn't connected.

## 1. Create the project
1. Go to https://console.firebase.google.com → **Add project**.
2. **Build → Authentication → Get started → Email/Password → Enable.** (Do not enable public sign-up in the app — there is no sign-up page.)
3. **Build → Firestore Database → Create database** (production mode, region `asia-south1` Mumbai).
4. **Build → Storage → Get started** (same region). Storage needs the Blaze plan on new projects.

## 2. Web app config (6 values)
Project settings → **Your apps → Web (</>)** → register → copy the config into these environment variables:

| Variable | From config |
|---|---|
| `VITE_FIREBASE_API_KEY` | apiKey |
| `VITE_FIREBASE_AUTH_DOMAIN` | authDomain |
| `VITE_FIREBASE_PROJECT_ID` | projectId |
| `VITE_FIREBASE_STORAGE_BUCKET` | storageBucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | messagingSenderId |
| `VITE_FIREBASE_APP_ID` | appId |

These are public web identifiers (not secrets) — safe in the browser. Security comes from the rules below. **Never** put a service-account JSON in this project.

Also add your published domain under Authentication → Settings → **Authorized domains**.

## 3. Security rules
- Firestore → Rules → paste `firestore.rules` → Publish.
- Storage → Rules → paste `storage.rules` → Publish.

## 4. Create the first admin (securely)
1. Authentication → Users → **Add user** (email + strong password).
2. Copy that user's **User UID**.
3. Firestore → **Start collection** `admins` → Document ID = the UID → add field `email` (string). Save.

Only users listed in `admins` can change the menu or upload photos — enforced by the rules, not by hiding the URL. Add/remove admins the same way.

## 5. First run
Open `/admin`, sign in, and click **Load sample menu** to start, then edit names, prices and photos.
