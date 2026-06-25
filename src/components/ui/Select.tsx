"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
}

const Select = forwardRef<HTMLButtonElement, SelectProps>(
  ({ id, options, placeholder = "Select…", value, onValueChange, disabled, hasError }, ref) => {
    return (
      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger
          ref={ref}
          id={id}
          className={`select-trigger${hasError ? " select-error" : ""}`}
          aria-invalid={hasError}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon className="select-icon">
            <ChevronDown size={16} strokeWidth={1.8} />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content className="select-content" position="popper" sideOffset={6}>
            <RadixSelect.Viewport className="select-viewport">
              {options.map((opt) => (
                <RadixSelect.Item key={opt.value} value={opt.value} className="select-item">
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="select-item-check">
                    <Check size={14} strokeWidth={2.5} />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    );
  }
);

Select.displayName = "Select";
export default Select;
