"use client";

import ReactPhoneInput, { type Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface Props {
  id?: string;
  value?: string;
  onChange: (value: string) => void;
  defaultIso2?: string;
  hasError?: boolean;
  autoComplete?: string;
}

export default function PhoneInput({
  id,
  value,
  onChange,
  defaultIso2 = "ng",
  hasError,
  autoComplete = "tel",
}: Props) {
  return (
    <div className={`phone-input${hasError ? " phone-input--error" : ""}`}>
      <ReactPhoneInput
        defaultCountry={defaultIso2.toUpperCase() as Country}
        value={value || undefined}
        onChange={(val) => onChange(val ?? "")}
        id={id}
        placeholder="080 1234 5678"
        numberInputProps={{ autoComplete }}
      />
    </div>
  );
}
