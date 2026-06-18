"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "@/components/ui/PhoneInput";
import Select from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";

const schema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    phone: z.string().optional(),
    email: z.string().optional(),
    subject: z.string().min(1, { message: "Please select a subject" }),
    message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  })
  .superRefine((data, ctx) => {
    const phone = (data.phone ?? "").replace(/\D/g, "");
    const email = (data.email ?? "").trim();
    if (!phone && !email) {
      const msg = "Please provide a phone number or email — we need at least one way to reach you.";
      ctx.addIssue({ code: "custom", message: msg, path: ["phone"] });
      ctx.addIssue({ code: "custom", message: " ", path: ["email"] });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      ctx.addIssue({
        code: "custom",
        message: "Please enter a valid email address.",
        path: ["email"],
      });
    }
    if (phone && phone.length < 7) {
      ctx.addIssue({
        code: "custom",
        message: "Please enter a valid phone number.",
        path: ["phone"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

const SUBJECTS = [
  { value: "order", label: "Order enquiry" },
  { value: "academy", label: "Academy / courses" },
  { value: "factory", label: "Garment factory project" },
  { value: "wholesale", label: "Wholesale partnership" },
  { value: "other", label: "Something else" },
];

function FieldError({ message }: { message?: string }) {
  if (!message || message.trim() === "") return null;
  return (
    <p className="field-error">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
      </svg>
      {message}
    </p>
  );
}

export default function ContactForm() {
  const { toast } = useToast();

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", subject: "", message: "" },
  });

  async function onSubmit(data: FormValues) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast("Message sent!", { description: "We'll get back to you within 24 hours." });
      reset();
    } catch {
      toast("Something went wrong", { description: "Please try again or chat with us on WhatsApp.", variant: "error" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="field-row">
        <div className="field">
          <label htmlFor="c-name">Full name</label>
          <input
            id="c-name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            className={errors.name ? "input-error" : undefined}
            {...register("name")}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div className="field">
          <label htmlFor="c-phone">
            Phone / WhatsApp
            <span className="field-or-hint">or email below</span>
          </label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                id="c-phone"
                value={field.value}
                onChange={field.onChange}
                defaultIso2="ng"
                hasError={!!errors.phone}
                autoComplete="tel"
              />
            )}
          />
          <FieldError message={errors.phone?.message} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="c-email">
          Email address
          <span className="field-or-hint">or phone above</span>
        </label>
        <input
          id="c-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          className={errors.email ? "input-error" : undefined}
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div className="field">
        <label htmlFor="c-subject">Subject</label>
        <Controller
          name="subject"
          control={control}
          render={({ field }) => (
            <Select
              id="c-subject"
              options={SUBJECTS}
              placeholder="Select a topic…"
              value={field.value}
              onValueChange={field.onChange}
              hasError={!!errors.subject}
            />
          )}
        />
        <FieldError message={errors.subject?.message} />
      </div>

      <div className="field">
        <label htmlFor="c-message">Message</label>
        <textarea
          id="c-message"
          rows={5}
          placeholder="How can we help you?"
          className={errors.message ? "input-error" : undefined}
          {...register("message")}
        />
        <FieldError message={errors.message?.message} />
      </div>

      <button type="submit" className="btn" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send Message"}
        {!isSubmitting && (
          <svg className="arw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        )}
      </button>
    </form>
  );
}
