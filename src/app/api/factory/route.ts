import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB total

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Phone is required"),
  email: z.string().email("Invalid email address"),
  service: z.string().min(1, "Please select a service"),
  details: z.string().min(10, "Please describe your project (at least 10 characters)"),
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const body = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    service: formData.get("service") as string,
    details: formData.get("details") as string,
  };

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const files = formData.getAll("files") as File[];
  let totalSize = 0;
  const attachments: { filename: string; content: Buffer }[] = [];

  for (const file of files) {
    if (file.size === 0) continue;
    totalSize += file.size;
    if (totalSize > MAX_FILE_SIZE) {
      return NextResponse.json({ error: { files: ["Total file size exceeds 20 MB"] } }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    attachments.push({ filename: file.name, content: buffer });
  }

  const { name, phone, email, service, details } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[factory] Resend key not set. Would send:", { name, email, service, files: files.length });
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "Vedil Website <noreply@vedilclothing.com>",
    to: ["hello@vedilclothing.com"],
    replyTo: email,
    subject: `Factory enquiry: ${service}`,
    html: `
      <h2>New factory enquiry</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 12px;font-weight:600">Name</td><td style="padding:6px 12px">${name}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600">Email</td><td style="padding:6px 12px">${email}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600">Phone</td><td style="padding:6px 12px">${phone}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600">Service</td><td style="padding:6px 12px">${service}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;vertical-align:top">Details</td><td style="padding:6px 12px;white-space:pre-wrap">${details}</td></tr>
        ${attachments.length ? `<tr><td style="padding:6px 12px;font-weight:600">Files</td><td style="padding:6px 12px">${attachments.map(a => a.filename).join(", ")}</td></tr>` : ""}
      </table>
    `,
    attachments: attachments.map((a) => ({ filename: a.filename, content: a.content })),
  });

  if (error) {
    console.error("[factory] Resend error:", error);
    return NextResponse.json({ error: "Failed to send enquiry" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
