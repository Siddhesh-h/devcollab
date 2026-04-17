console.log("DB URL:", process.env.DATABASE_URL);
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
