"use client";

import * as RadixToast from "@radix-ui/react-toast";
import { Check, X } from "lucide-react";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastVariant = "success" | "error";

interface ToastMessage {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (title: string, opts?: { description?: string; variant?: ToastVariant }) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  let counter = 0;

  const toast = useCallback((title: string, opts?: { description?: string; variant?: ToastVariant }) => {
    const id = ++counter;
    setMessages((prev) => [...prev, { id, title, description: opts?.description, variant: opts?.variant ?? "success" }]);
    setTimeout(() => setMessages((prev) => prev.filter((m) => m.id !== id)), 5000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      <RadixToast.Provider swipeDirection="right">
        {children}
        {messages.map((msg) => (
          <RadixToast.Root key={msg.id} className={`toast toast--${msg.variant}`} duration={4500}>
            <div className="toast-body">
              <span className="toast-icon" aria-hidden>
                {msg.variant === "success" ? (
                  <Check size={16} strokeWidth={2.5} />
                ) : (
                  <X size={16} strokeWidth={2.5} />
                )}
              </span>
              <div>
                <RadixToast.Title className="toast-title">{msg.title}</RadixToast.Title>
                {msg.description && <RadixToast.Description className="toast-desc">{msg.description}</RadixToast.Description>}
              </div>
            </div>
            <RadixToast.Close className="toast-close" aria-label="Dismiss">
              <X size={14} strokeWidth={2} />
            </RadixToast.Close>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className="toast-viewport" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}
