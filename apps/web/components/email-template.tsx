import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Row,
    Column,
    Section,
    Text,
    Tailwind,
} from "@react-email/components";
import * as React from "react";

interface EmailTemplateProps {
    type: "feature" | "bug";
    name: string;
    email: string;
    title: string;
    description: string;
    priority?: string;
    steps?: string;
}

const priorityColors: Record<string, { bg: string; text: string; label: string }> = {
    low: { bg: "#d1fae5", text: "#065f46", label: "LOW" },
    medium: { bg: "#fef3c7", text: "#92400e", label: "MEDIUM" },
    high: { bg: "#fee2e2", text: "#b91c1c", label: "HIGH" },
    critical: { bg: "#fee2e2", text: "#b91c1c", label: "CRITICAL" },
};

export const EmailTemplate = ({
    type,
    name,
    email,
    title,
    description,
    priority,
    steps,
}: EmailTemplateProps) => {
    const isFeature = type === "feature";
    const accentColor = isFeature ? "#6366f1" : "#ef4444";
    const previewText = isFeature
        ? `Feature Request: ${title}`
        : `Bug Report: ${title}`;

    const p = priority ? priorityColors[priority] ?? priorityColors.medium : null;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-[#f4f4f5] my-auto mx-auto font-sans">
                    <Container className="my-10 mx-auto w-[520px]">

                        {/* Card */}
                        <Section className="bg-white rounded-2xl overflow-hidden shadow-sm">

                            {/* Accent bar */}
                            <div style={{ backgroundColor: accentColor, height: "4px", width: "100%" }} />

                            {/* Header */}
                            <Section className="px-10 pt-10 pb-6">
                                <Row>
                                    <Column>
                                        {/* Type badge */}
                                        <div
                                            style={{
                                                display: "inline-block",
                                                backgroundColor: isFeature ? "#eef2ff" : "#fef2f2",
                                                borderRadius: "999px",
                                                padding: "5px 14px",
                                                marginBottom: "20px",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: "11px",
                                                    fontWeight: 700,
                                                    letterSpacing: "1px",
                                                    textTransform: "uppercase",
                                                    color: accentColor,
                                                }}
                                            >
                                                {isFeature ? "Feature Request" : "Bug Report"}
                                            </span>
                                        </div>

                                        <Heading
                                            className="text-[26px] font-bold text-[#111827] m-0 leading-tight"
                                        >
                                            {title}
                                        </Heading>
                                    </Column>
                                </Row>
                            </Section>

                            <Hr className="border-t border-[#f3f4f6] mx-10 my-0" />

                            {/* From */}
                            <Section className="px-10 py-6">
                                <Text className="text-[11px] font-semibold uppercase tracking-widest text-[#9ca3af] m-0 mb-2">
                                    From
                                </Text>
                                <Text className="text-[15px] font-semibold text-[#111827] m-0">
                                    {name}
                                </Text>
                                <Text className="text-[13px] text-[#6b7280] m-0 mt-0.5">
                                    {email}
                                </Text>
                            </Section>

                            <Hr className="border-t border-[#f3f4f6] mx-10 my-0" />

                            {/* Description */}
                            <Section className="px-10 py-6">
                                <Text className="text-[11px] font-semibold uppercase tracking-widest text-[#9ca3af] m-0 mb-3">
                                    {isFeature ? "Description / Use Case" : "What happened?"}
                                </Text>
                                <div
                                    style={{
                                        backgroundColor: "#f9fafb",
                                        borderLeft: `3px solid ${accentColor}`,
                                        borderRadius: "0 8px 8px 0",
                                        padding: "14px 16px",
                                    }}
                                >
                                    <Text
                                        className="text-[14px] text-[#374151] leading-relaxed m-0"
                                        style={{ whiteSpace: "pre-wrap" }}
                                    >
                                        {description}
                                    </Text>
                                </div>
                            </Section>

                            {/* Steps to reproduce (bugs only) */}
                            {steps && (
                                <>
                                    <Hr className="border-t border-[#f3f4f6] mx-10 my-0" />
                                    <Section className="px-10 py-6">
                                        <Text className="text-[11px] font-semibold uppercase tracking-widest text-[#9ca3af] m-0 mb-3">
                                            Steps to Reproduce
                                        </Text>
                                        <Text
                                            className="text-[14px] text-[#374151] leading-relaxed m-0"
                                            style={{ whiteSpace: "pre-wrap" }}
                                        >
                                            {steps}
                                        </Text>
                                    </Section>
                                </>
                            )}

                            {/* Priority / Severity */}
                            {p && (
                                <>
                                    <Hr className="border-t border-[#f3f4f6] mx-10 my-0" />
                                    <Section className="px-10 py-6">
                                        <Text className="text-[11px] font-semibold uppercase tracking-widest text-[#9ca3af] m-0 mb-3">
                                            {isFeature ? "Priority" : "Severity"}
                                        </Text>
                                        <span
                                            style={{
                                                display: "inline-block",
                                                padding: "4px 12px",
                                                borderRadius: "999px",
                                                fontSize: "12px",
                                                fontWeight: 700,
                                                letterSpacing: "0.5px",
                                                backgroundColor: p.bg,
                                                color: p.text,
                                            }}
                                        >
                                            {p.label}
                                        </span>
                                    </Section>
                                </>
                            )}

                            {/* Bottom padding */}
                            <Section className="h-4" />
                        </Section>

                        {/* Footer */}
                        <Section className="px-6 py-6">
                            <Text className="text-[12px] text-[#9ca3af] text-center m-0">
                                Sent automatically from{" "}
                                <span style={{ fontWeight: 600, color: "#6b7280" }}>Cenra</span>
                                . Please do not reply to this email.
                            </Text>
                        </Section>

                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};