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
