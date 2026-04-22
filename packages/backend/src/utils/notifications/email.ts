import { Resend } from "resend";

type EscalationEmailPayload = {
  to: string;
  customerDisplayName: string;
  customerEmail: string;
  messagePreview: string;
  conversationUrl: string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const sendEscalationEmail = async ({
  to,
  customerDisplayName,
  customerEmail,
  messagePreview,
  conversationUrl,
}: EscalationEmailPayload) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      "Skipping escalation email because RESEND_API_KEY or RESEND_FROM_EMAIL is not configured.",
    );
    return;
  }

  const resend = new Resend(apiKey);

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
      <h2 style="margin-bottom: 12px;">New escalated conversation</h2>
      <p style="margin: 0 0 8px;"><strong>Customer:</strong> ${escapeHtml(customerDisplayName)}</p>
      <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(customerEmail)}</p>
      <p style="margin: 0 0 8px;"><strong>Message preview:</strong></p>
      <p style="margin: 0 0 16px; padding: 12px; background: #f3f4f6; border-radius: 8px;">${escapeHtml(messagePreview)}</p>
      <a
        href="${escapeHtml(conversationUrl)}"
        style="display: inline-block; padding: 10px 16px; background: #065f46; color: #ffffff; text-decoration: none; border-radius: 8px;"
      >
        Open conversation
      </a>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: "Cenra Support <onboarding@resend.dev>",
    to: [to],
    subject: "New escalated conversation",
    html,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message ?? "Failed to send escalation email");
  }

  return data;
};
