import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactFormSchema } from "@/lib/validators/contact";
import nodemailer from "nodemailer";

/* ── Gmail SMTP transporter ── */
function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

/* ── Build a clean HTML email ── */
function buildEmailHtml(data: {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  id: number;
  createdAt: Date;
}) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="background: #000; padding: 20px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #EAFF56; margin: 0; font-size: 20px; font-weight: 700;">daur.</h1>
      </div>
      <div style="background: #ffffff; border: 1px solid #e8e8e8; border-top: none; border-radius: 0 0 12px 12px; padding: 28px 24px;">
        <h2 style="color: #000; margin: 0 0 4px; font-size: 18px;">New Contact Message</h2>
        <p style="color: #888; font-size: 13px; margin: 0 0 20px;">Ref #${data.id} · ${data.createdAt.toLocaleString()}</p>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #888; width: 120px; vertical-align: top;">Name</td>
            <td style="padding: 8px 0; color: #000; font-weight: 500;">${data.firstName}${data.lastName ? " " + data.lastName : ""}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888; vertical-align: top;">Email</td>
            <td style="padding: 8px 0; color: #000;"><a href="mailto:${data.email}" style="color: #000; text-decoration: underline;">${data.email}</a></td>
          </tr>
          ${data.phone ? `<tr><td style="padding: 8px 0; color: #888; vertical-align: top;">Phone</td><td style="padding: 8px 0; color: #000;">${data.phone}</td></tr>` : ""}
          ${data.subject ? `<tr><td style="padding: 8px 0; color: #888; vertical-align: top;">Subject</td><td style="padding: 8px 0; color: #000;">${data.subject}</td></tr>` : ""}
        </table>
        
        <div style="margin-top: 20px; padding: 16px; background: #fafafa; border: 1px solid #ececec; border-radius: 10px;">
          <p style="color: #888; font-size: 12px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
          <p style="color: #000; font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${data.message}</p>
        </div>
        
        <p style="color: #aaa; font-size: 12px; margin: 20px 0 0; text-align: center;">
          Reply directly to this email to respond to ${data.firstName}.
        </p>
      </div>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validate with Zod
    const result = contactFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, phone, subject, message } = result.data;

    // 2. Store in database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        firstName,
        lastName: lastName || null,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
      },
    });

    // 3. Send email notification (non-blocking — don't fail the request if email fails)
    try {
      const gmailUser = process.env.GMAIL_USER;
      const gmailPass = process.env.GMAIL_APP_PASSWORD;

      if (gmailUser && gmailPass) {
        const transporter = createTransporter();
        await transporter.sendMail({
          from: `"Daur Contact" <${gmailUser}>`,
          replyTo: email,
          to: gmailUser,
          subject: `[Daur Contact] ${subject || "New message"} from ${firstName}`,
          html: buildEmailHtml({
            ...contactMessage,
            firstName,
            lastName: lastName || undefined,
            email,
            phone: phone || undefined,
            subject: subject || undefined,
            message,
          }),
        });
      } else {
        console.warn(
          "GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping email notification"
        );
      }
    } catch (emailError) {
      // Log but don't fail the request — the message is already saved
      console.error("Failed to send email notification:", emailError);
    }

    return NextResponse.json(
      { message: "Message sent successfully", id: contactMessage.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
