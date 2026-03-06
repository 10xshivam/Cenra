"use server";

import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SupportEmailPayload {
    type: "feature" | "bug";
    name: string;
    email: string;
    title: string;
    description: string;
    priority?: string;
    steps?: string;
}

export async function sendSupportEmail(payload: SupportEmailPayload) {
    const { type, name, email, title, description, priority, steps } = payload;

    const subjectMap: Record<string, string> = {
        feature: `Feature Request: ${title}`,
        bug: `Bug Report: ${title}`,
    };

    const { data, error } = await resend.emails.send({
        from: "Cenra Support <onboarding@resend.dev>",
        to: ["tryy.shivam@gmail.com"],
        subject: subjectMap[type] ?? `Support: ${title}`,
        react: EmailTemplate({ type, name, email, title, description, priority, steps }),
    });

    if (error) {
        console.error("Resend error:", error);
        throw new Error(error.message ?? "Failed to send email");
    }

    return data;
}
