import { addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { fb } from "./firebase";
import { DEMO_CATEGORIES, DEMO_ITEMS } from "./demo-menu";
import type { Category, FoodItem, ItemInput } from "./menu-types";

export async function isAdmin(uid: string) {
  const snap = await getDoc(doc(fb().db, "admins", uid));
  return snap.exists();
}

export function uploadImage(file: File, onProgress: (pct: number) => void): Promise<{ url: string; path: string }> {
  const safe = file.name.replace(/[^a-zA-Z0-9.]+/g, "-").slice(-60);
  const path = `foodImages/${Date.now()}-${safe}`;
  const task = uploadBytesResumable(ref(fb().storage, path), file, { contentType: file.type });
  return new Promise((resolve, reject) => {
    task.on("state_changed", (s) => onProgress(Math.round((s.bytesTransferred / s.totalBytes) * 100)), reject, async () => resolve({ url: await getDownloadURL(task.snapshot.ref), path }));
  });
}

/** Deletes a Storage image only if no other item still references it. */
export async function deleteImageIfUnused(path: string, items: FoodItem[], exceptId?: string) {
  if (!path) return;
  if (items.some((i) => i.id !== exceptId && i.imagePath === path)) return;
  try { await deleteObject(ref(fb().storage, path)); } catch (e) {
    if ((e as { code?: string }).code !== "storage/object-not-found") throw e;
  }
}

export async function createItem(data: ItemInput) {
  await addDoc(collection(fb().db, "foodItems"), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}
export async function updateItem(id: string, data: Partial<ItemInput>) {
  await updateDoc(doc(fb().db, "foodItems", id), { ...data, updatedAt: serverTimestamp() });
}
export async function removeItem(item: FoodItem, all: FoodItem[]) {
  await deleteDoc(doc(fb().db, "foodItems", item.id));
  await deleteImageIfUnused(item.imagePath, all, item.id);
}

export async function saveCategory(c: Omit<Category, "id"> & { id?: string }) {
  const { id, ...rest } = c;
  if (id) await updateDoc(doc(fb().db, "categories", id), rest);
  else await addDoc(collection(fb().db, "categories"), { ...rest, createdAt: serverTimestamp() });
}

/** Moves items to `reassignTo` (if any) and deletes the category atomically. */
export async function deleteCategory(id: string, items: FoodItem[], reassignTo: string | null) {
  const inCat = items.filter((i) => i.categoryId === id);
  if (inCat.length && !reassignTo) throw new Error("Move this category's dishes to another category first.");
  const b = writeBatch(fb().db);
  inCat.forEach((i) => b.update(doc(fb().db, "foodItems", i.id), { categoryId: reassignTo, updatedAt: serverTimestamp() }));
  b.delete(doc(fb().db, "categories", id));
  await b.commit();
}

export async function seedDemoMenu() {
  const b = writeBatch(fb().db);
  DEMO_CATEGORIES.forEach(({ id, ...c }) => b.set(doc(fb().db, "categories", id), { ...c, createdAt: serverTimestamp() }));
  DEMO_ITEMS.forEach(({ id, ...i }) => b.set(doc(fb().db, "foodItems", id), { ...i, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }));
  await b.commit();
}

export { setDoc };
