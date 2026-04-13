"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookController = void 0;
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("@workspace/db");
const webhookController = async (req, res) => {
    const id = req.headers["webhook-id"];
    const signatureHeader = req.headers["webhook-signature"];
    const timestamp = req.headers["webhook-timestamp"];
    const rawBody = req.body; // Buffer from express.raw()
    if (!id || !signatureHeader || !timestamp) {
        return res.status(400).send("Missing webhook headers");
    }
    const signatures = signatureHeader.split(" ");
    const signedPayload = `${id}.${timestamp}.${rawBody.toString()}`;
    let isValid = false;
    for (const sig of signatures) {
        const [version, hash] = sig.split(",");
        if (version !== "v1" || !hash)
            continue;
        try {
            const secret = process.env.WEBHOOK_SECRET.replace("whsec_", "");
            const secretBuffer = Buffer.from(secret, "base64");
            const expectedSignatureBuffer = crypto_1.default
                .createHmac("sha256", secretBuffer)
                .update(signedPayload)
                .digest();
            const signatureBuffer = Buffer.from(hash, "base64");
            if (signatureBuffer.length === expectedSignatureBuffer.length &&
                crypto_1.default.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)) {
                isValid = true;
                break;
            }
        }
        catch (err) {
            console.error("Signature verification error:", err);
            continue;
        }
    }
    if (!isValid) {
        console.error("Invalid webhook signature");
        return res.status(400).send("Invalid signature");
    }
    const event = JSON.parse(rawBody.toString());
    const { type, data } = event;
    const userId = data?.metadata?.userId;
    const plan = data?.metadata?.plan;
    if (!userId || !plan) {
        return res.status(200).send("Ignored");
    }
    switch (type) {
        case "subscription.active":
        case "subscription.renewed":
            await db_1.prisma.subscription.upsert({
                where: { userId },
                update: {
                    status: "ACTIVE",
                    plan,
                    endsAt: new Date(data.next_billing_date),
                },
                create: {
                    userId,
                    plan,
                    status: "ACTIVE",
                    startedAt: new Date(),
                    endsAt: new Date(data.next_billing_date),
                },
            });
            break;
        case "subscription.on_hold":
        case "payment.failed":
            await db_1.prisma.subscription.update({
                where: { userId },
                data: { status: "PAST_DUE" },
            });
            break;
        case "subscription.cancelled":
            await db_1.prisma.subscription.update({
                where: { userId },
                data: { status: "CANCELLED" },
            });
            break;
    }
    return res.status(200).send("OK");
};
exports.webhookController = webhookController;
