import { prisma } from "@workspace/db";
import { Request, Response } from "express";

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;

    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID is required" });
    }

    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    let customer = await prisma.customer.findFirst({
      where: {
        email,
        workspaceId,
      },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name,
          email,
          workspaceId,
        },
      });
    }

    return res
      .status(201)
      .json({
        message: "Customer created successfully",
        customerId: customer.id,
      });
  } catch (error) {
    console.error("Error creating customer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCustomer = async (req: Request, res: Response) => {
  try {
    const { workspaceId, conversationId } = req.params; 
    if (!workspaceId || !conversationId) {
      return res
        .status(400)
        .json({ message: "Workspace ID and Conversation ID are required" });
    } 
    const conversation = await prisma.conversation.findFirst({
      where: {
      id: conversationId,
      workspaceId,
      },
      include: {
      customer: true,
      },
    });

    const customer = conversation?.customer;

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    return res.status(200).json({ customer });
  } catch (error) {
    console.error("Error retrieving customer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};