"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────

export type CartItem = {
  id: string;
  name: string;
  retailPrice: number;
  wholesalePrice: number | null;
  moq: number; // qty needed to unlock wholesale price
  quantity: number;
  size?: string;
  category?: string;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

type CartAction =
  | { type: "ADD"; item: Omit<CartItem, "quantity"> }
  | { type: "REMOVE"; id: string }
  | { type: "SET_QTY"; id: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "HYDRATE"; items: CartItem[] };

// ─── Price helper ─────────────────────────────────────────────

export function effectivePrice(item: CartItem): number {
  if (item.wholesalePrice !== null && item.quantity >= item.moq) {
    return item.wholesalePrice;
  }
  return item.retailPrice;
}

export function fmtPrice(n: number): string {
  return "₦" + n.toLocaleString("en-NG");
}

// ─── Reducer ──────────────────────────────────────────────────

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        ...state,
        isOpen: true,
        items: [...state.items, { ...action.item, quantity: 1 }],
      };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "SET_QTY":
      if (action.quantity < 1) {
        return { ...state, items: state.items.filter((i) => i.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      };
    case "CLEAR":
      return { ...state, items: [] };
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "HYDRATE":
      return { ...state, items: action.items };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], isOpen: false });

  // Restore cart from localStorage on first render
  useEffect(() => {
    try {
      const raw = localStorage.getItem("vedil_cart");
      if (raw) dispatch({ type: "HYDRATE", items: JSON.parse(raw) });
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist whenever items change
  useEffect(() => {
    localStorage.setItem("vedil_cart", JSON.stringify(state.items));
  }, [state.items]);

  // Lock page scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = state.isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [state.isOpen]);

  const itemCount = state.items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = state.items.reduce(
    (s, i) => s + effectivePrice(i) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        itemCount,
        subtotal,
        addItem: (item) => dispatch({ type: "ADD", item }),
        removeItem: (id) => dispatch({ type: "REMOVE", id }),
        setQty: (id, quantity) => dispatch({ type: "SET_QTY", id, quantity }),
        clearCart: () => dispatch({ type: "CLEAR" }),
        openCart: () => dispatch({ type: "OPEN" }),
        closeCart: () => dispatch({ type: "CLOSE" }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
