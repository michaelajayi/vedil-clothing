"use client";

import * as Popover from "@radix-ui/react-popover";
import { useState, useMemo, useRef } from "react";

interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  id?: string;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export default function Combobox({
  id,
  options,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  value,
  onValueChange,
  disabled,
  hasError,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [query, options]);

  function handleSelect(opt: ComboboxOption) {
    onValueChange?.(opt.value);
    setOpen(false);
    setQuery("");
  }

  return (
    <Popover.Root open={open} onOpenChange={(v) => { setOpen(v); if (v) setTimeout(() => inputRef.current?.focus(), 50); }}>
      <Popover.Trigger
        id={id}
        disabled={disabled}
        className={`select-trigger${hasError ? " select-error" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={hasError}
        type="button"
      >
        <span style={{ color: selected ? "inherit" : "var(--ink-soft)" }}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="select-icon" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
            style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform .2s" }}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="select-content"
          style={{ width: "var(--radix-popover-trigger-width)" }}
          sideOffset={6}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="combobox-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              className="combobox-search-input"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Escape") { setOpen(false); setQuery(""); } }}
            />
          </div>

          <div className="select-viewport" role="listbox">
            {filtered.length === 0 ? (
              <div className="combobox-empty">No results</div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={opt.value === value}
                  className={`select-item${opt.value === value ? " select-item--selected" : ""}`}
                  onClick={() => handleSelect(opt)}
                >
                  {opt.label}
                  {opt.value === value && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </button>
              ))
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
