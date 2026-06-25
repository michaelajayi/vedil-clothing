"use client";

interface Props {
  id?: string;
  value?: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  autoComplete?: string;
}

export default function PhoneInput({
  id,
  value = "",
  onChange,
  hasError,
  autoComplete = "tel",
}: Props) {
  const rawLocal = value.startsWith("+234") ? value.slice(4) : value;

  function formatLocal(digits: string): string {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return digits.slice(0, 3) + " " + digits.slice(3);
    return digits.slice(0, 3) + " " + digits.slice(3, 6) + " " + digits.slice(6);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d]/g, "").replace(/^0+/, "").slice(0, 10);
    onChange(raw ? "+234" + raw : "");
  }

  return (
    <div className={`phone-input${hasError ? " phone-input--error" : ""}`}>
      <div className="phone-input__prefix">+234</div>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        className="phone-input__number"
        placeholder="801 234 5678"
        value={formatLocal(rawLocal)}
        onChange={handleChange}
        autoComplete={autoComplete}
        minLength={7}
        maxLength={12}
      />
    </div>
  );
}
