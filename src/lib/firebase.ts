// Firebase web config is public by design; security comes from firestore.rules / storage.rules.
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const config = {
  apiKey: (import.meta.env["VITE_FIREBASE_API_KEY"] as string | undefined) ?? "",
  authDomain: (import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"] as string | undefined) ?? "",
  projectId: (import.meta.env["VITE_FIREBASE_PROJECT_ID"] as string | undefined) ?? "",
  storageBucket: (import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"] as string | undefined) ?? "",
  messagingSenderId: (import.meta.env["VITE_FIREBASE_MESSAGING_SENDER_ID"] as string | undefined) ?? "",
  appId: (import.meta.env["VITE_FIREBASE_APP_ID"] as string | undefined) ?? "",
};

export const firebaseConfigured = !!(config.apiKey && config.projectId && config.appId && config.storageBucket);

let cache: { app: FirebaseApp; auth: Auth; db: Firestore; storage: FirebaseStorage } | null = null;

/** Call only in the browser (effects / handlers). */
export function fb() {
  if (!firebaseConfigured) throw new Error("Firebase is not configured yet.");
  if (!cache) {
    const app = getApps()[0] ?? initializeApp(config);
    cache = { app, auth: getAuth(app), db: getFirestore(app), storage: getStorage(app) };
  }
  return cache;
}

export function firebaseErrorMessage(e: unknown): string {
  const code = (e as { code?: string })?.code ?? "";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) return "Incorrect email or password.";
  if (code.includes("too-many-requests")) return "Too many attempts. Please wait and try again.";
  if (code.includes("permission-denied") || code.includes("unauthorized")) return "You don't have permission to do this.";
  if (code.includes("unavailable") || code.includes("network")) return "Can't reach Firebase. Check your internet connection.";
  return (e as Error)?.message || "Something went wrong.";
}
