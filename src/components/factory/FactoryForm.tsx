"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, ArrowRight } from "lucide-react";
import PhoneInput from "@/components/ui/PhoneInput";
import Select from "@/components/ui/Select";
import FileUpload from "@/components/ui/FileUpload";
import { useToast } from "@/components/ui/Toast";
import { useSubmitFactoryInquiry } from "@/lib/queries/inquiries";
import { ApiError } from "@/lib/api";

const schema = z
	.object({
		name: z.string().min(2, { message: "Name must be at least 2 characters" }),
		phone: z.string().optional(),
		email: z.string().optional(),
		service: z.string().min(1, { message: "Please select a service" }),
		details: z.string().min(10, {
			message: "Please describe your project (at least 10 characters)",
		}),
	})
	.superRefine((data, ctx) => {
		const phone = (data.phone ?? "").replace(/\D/g, "");
		const email = (data.email ?? "").trim();
		if (!phone && !email) {
			const msg =
				"Please provide a phone number or email — we need at least one way to reach you.";
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

const SERVICES = [
	{ value: "bulk", label: "Bulk production (40+ pieces)" },
	{ value: "custom", label: "Custom order (personal / small group)" },
	{ value: "wholesale", label: "Wholesale partnership" },
];

function FieldError({ message }: { message?: string }) {
	if (!message || message.trim() === "") return null;
	return (
		<p className="field-error">
			<CircleAlert size={12} strokeWidth={2.5} />
			{message}
		</p>
	);
}

export default function FactoryForm() {
	const { toast } = useToast();
	const [files, setFiles] = useState<File[]>([]);
	const [fileError, setFileError] = useState<string | null>(null);

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { name: "", phone: "", email: "", service: "", details: "" },
	});

	const factoryMutation = useSubmitFactoryInquiry();

	async function onSubmit(data: FormValues) {
		if (fileError) {
			toast("File upload error", {
				description: fileError,
				variant: "error",
			});
			return;
		}
		try {
			await factoryMutation.mutateAsync({
				name: data.name,
				phone: data.phone || "",
				email: data.email || "",
				// Backend expects uppercase enum values
				service: data.service.toUpperCase() as "BULK" | "CUSTOM" | "WHOLESALE",
				details: data.details,
				files: files.length > 0 ? files : undefined,
			});
			toast("Enquiry sent!", {
				description: "We'll reach out within 24 hours to discuss your project.",
			});
			reset();
			setFiles([]);
		} catch (err) {
			const message =
				err instanceof ApiError &&
				typeof err.body === "object" &&
				err.body &&
				"message" in err.body
					? (err.body as { message: string }).message
					: "Please try again or message us directly on WhatsApp.";
			toast("Could not send", {
				description: message,
				variant: "error",
			});
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate>
			<div className="field-row">
				<div className="field">
					<label htmlFor="gf-name">Full name</label>
					<input
						id="gf-name"
						type="text"
						placeholder="Your name"
						autoComplete="name"
						className={errors.name ? "input-error" : undefined}
						{...register("name")}
					/>
					<FieldError message={errors.name?.message} />
				</div>
				<div className="field">
					<label htmlFor="gf-phone">
						Phone / WhatsApp
						<span className="field-or-hint">or email below</span>
					</label>
					<Controller
						name="phone"
						control={control}
						render={({ field }) => (
							<PhoneInput
								id="gf-phone"
								value={field.value}
								onChange={field.onChange}
								hasError={!!errors.phone}
								autoComplete="tel"
							/>
						)}
					/>
					<FieldError message={errors.phone?.message} />
				</div>
			</div>

			<div className="field">
				<label htmlFor="gf-email">
					Email address
					<span className="field-or-hint">or phone above</span>
				</label>
				<input
					id="gf-email"
					type="email"
					placeholder="you@example.com"
					autoComplete="email"
					className={errors.email ? "input-error" : undefined}
					{...register("email")}
				/>
				<FieldError message={errors.email?.message} />
			</div>

			<div className="field">
				<label htmlFor="gf-service">Service needed</label>
				<Controller
					name="service"
					control={control}
					render={({ field }) => (
						<Select
							id="gf-service"
							options={SERVICES}
							placeholder="Select a service…"
							value={field.value}
							onValueChange={field.onChange}
							hasError={!!errors.service}
						/>
					)}
				/>
				<FieldError message={errors.service?.message} />
			</div>

			<div className="field">
				<label htmlFor="gf-details">Tell us more</label>
				<textarea
					id="gf-details"
					rows={5}
					placeholder="Describe your design, quantity, timeline, fabric preferences…"
					className={errors.details ? "input-error" : undefined}
					{...register("details")}
				/>
				<FieldError message={errors.details?.message} />
			</div>

			<div className="field">
				<FileUpload onChange={setFiles} onError={setFileError} />
			</div>

			<button type="submit" className="btn" disabled={isSubmitting}>
				{isSubmitting ? "Sending…" : "Send Enquiry"}
				{!isSubmitting && (
					<ArrowRight className="arw" size={16} strokeWidth={2} />
				)}
			</button>
		</form>
	);
}
