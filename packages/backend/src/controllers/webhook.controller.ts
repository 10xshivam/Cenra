import crypto from "crypto";
import { Request, Response } from "express";
import { prisma } from "@workspace/db";

export const webhookController = async (req: Request, res: Response) => {
  const id = req.headers["webhook-id"] as string;
  const signatureHeader = req.headers["webhook-signature"] as string;
  const timestamp = req.headers["webhook-timestamp"] as string;
  const rawBody = req.body; // Buffer from express.raw()

  if (!id || !signatureHeader || !timestamp) {
    return res.status(400).send("Missing webhook headers");
  }

  const signatures = signatureHeader.split(" ");
  const signedPayload = `${id}.${timestamp}.${rawBody.toString()}`;
  let isValid = false;

  for (const sig of signatures) {
    const [version, hash] = sig.split(",");
    if (version !== "v1" || !hash) continue;

    try {
      const secret = process.env.WEBHOOK_SECRET!.replace("whsec_", "");
      const secretBuffer = Buffer.from(secret, "base64");

      const expectedSignatureBuffer = crypto
        .createHmac("sha256", secretBuffer)
        .update(signedPayload)
        .digest();

      const signatureBuffer = Buffer.from(hash, "base64");

      if (
        signatureBuffer.length === expectedSignatureBuffer.length &&
        crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
      ) {
        isValid = true;
        break;
      }
    } catch (err) {
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
      await prisma.subscription.upsert({
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
      await prisma.subscription.update({
        where: { userId },
        data: { status: "PAST_DUE" },
      });
      break;

    case "subscription.cancelled":
      await prisma.subscription.update({
        where: { userId },
        data: { status: "CANCELLED" },
      });
      break;
  }

  return res.status(200).send("OK");
};
