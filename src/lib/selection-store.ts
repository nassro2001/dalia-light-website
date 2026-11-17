import type { SelectionItem } from "./whatsapp";

// Store externe pour « Ma sélection » (lu avec useSyncExternalStore).
// Persisté dans localStorage ; si le stockage est bloqué, la sélection vit en mémoire
// le temps de la visite (DIRECTION_VISUELLE.md §11).

const STORAGE_KEY = "dalia-light:selection";
const EMPTY: SelectionItem[] = [];

let items: SelectionItem[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function read(): SelectionItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    // Seuls les articles du catalogue de l'ERP (identifiant UUID) se demandent en devis : les anciens produits
    // d'exemple, gardés par un navigateur, sont écartés.
    return Array.isArray(parsed)
      ? (parsed as SelectionItem[]).filter((i) => /^[0-9a-f-]{36}$/i.test(i?.id ?? ""))
      : EMPTY;
  } catch {
    return items;
  }
}

function write(next: SelectionItem[]) {
  items = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // stockage indisponible : on garde la sélection en mémoire
  }
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  items = read();
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void) {
  if (!hydrated) {
    hydrated = true;
    items = read();
  }
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export const getSnapshot = () => items;
export const getServerSnapshot = () => EMPTY;

export function addItem(item: Omit<SelectionItem, "quantity">, quantity = 1) {
  const existing = items.find((i) => i.id === item.id && i.finish === item.finish);
  write(
    existing
      ? items.map((i) => (i === existing ? { ...i, quantity: i.quantity + quantity } : i))
      : [...items, { ...item, quantity }],
  );
}

export function setQuantity(id: string, finish: string | undefined, quantity: number) {
  write(
    quantity <= 0
      ? items.filter((i) => !(i.id === id && i.finish === finish))
      : items.map((i) => (i.id === id && i.finish === finish ? { ...i, quantity } : i)),
  );
}

export function removeItem(id: string, finish: string | undefined) {
  setQuantity(id, finish, 0);
}

export function clearSelection() {
  write(EMPTY);
}
