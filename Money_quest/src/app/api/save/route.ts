import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { gameState } = await req.json();
    if (!gameState) {
      return NextResponse.json({ error: "Missing game state" }, { status: 400 });
    }

    const userId = (session.user as any).id;

    // Save or update
    const existingSave = await prisma.saveGame.findFirst({
      where: { userId }
    });

    if (existingSave) {
      await prisma.saveGame.update({
        where: { id: existingSave.id },
        data: { gameState: JSON.stringify(gameState), lastPlayedAt: new Date() }
      });
    } else {
      await prisma.saveGame.create({
        data: {
          userId,
          gameState: JSON.stringify(gameState)
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
