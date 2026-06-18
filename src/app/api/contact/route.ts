import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Phone is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { name, phone, email, subject, message } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // In development / before key is set, log and return success so UI can be tested
    console.log("[contact] Resend key not set. Would send:", { name, email, subject });
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "Vedil Website <noreply@vedilclothing.com>",
    to: ["hello@vedilclothing.com"],
    replyTo: email,
    subject: `Contact form: ${subject}`,
    html: `
      <h2>New contact form submission</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 12px;font-weight:600">Name</td><td style="padding:6px 12px">${name}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600">Email</td><td style="padding:6px 12px">${email}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600">Phone</td><td style="padding:6px 12px">${phone}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600">Subject</td><td style="padding:6px 12px">${subject}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;vertical-align:top">Message</td><td style="padding:6px 12px;white-space:pre-wrap">${message}</td></tr>
      </table>
    `,
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
