"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import * as store from "@/lib/selection-store";
import type { SelectionItem } from "@/lib/whatsapp";

type SelectionContextValue = {
  items: SelectionItem[];
  count: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: Omit<SelectionItem, "quantity">, quantity?: number) => void;
  setQuantity: typeof store.setQuantity;
  remove: typeof store.removeItem;
  clear: typeof store.clearSelection;
  /** Incrémenté à chaque ajout : déclenche le bref allumage du compteur. */
  addedPulse: number;
  /** Une barre fixe (fiche produit) masque le bouton WhatsApp flottant pour ne pas doubler. */
  fabHidden: boolean;
  /** À appeler dans un effet : masque le bouton et renvoie la fonction qui le réaffiche. Compteur, et non booléen :
      robuste quand deux fiches se montent / démontent dans un ordre croisé (pages gardées en mémoire par Next). */
  hideFab: () => () => void;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);
  const [addedPulse, setAddedPulse] = useState(0);
  const [fabHiders, setFabHiders] = useState(0);
  const hideFab = useCallback(() => {
    setFabHiders((n) => n + 1);
    return () => setFabHiders((n) => n - 1);
  }, []);

  const add = useCallback((item: Omit<SelectionItem, "quantity">, quantity = 1) => {
    store.addItem(item, quantity);
    setAddedPulse((n) => n + 1);
  }, []);

  const value = useMemo<SelectionContextValue>(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQuantity: store.setQuantity,
      remove: store.removeItem,
      clear: store.clearSelection,
      addedPulse,
      fabHidden: fabHiders > 0,
      hideFab,
    }),
    [items, isOpen, add, addedPulse, fabHiders, hideFab],
  );

  return <SelectionContext value={value}>{children}</SelectionContext>;
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (!context) throw new Error("useSelection doit être utilisé dans <SelectionProvider>");
  return context;
}
