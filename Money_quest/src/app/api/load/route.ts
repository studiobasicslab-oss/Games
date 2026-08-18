import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const save = await prisma.saveGame.findFirst({
      where: { userId },
      orderBy: { lastPlayedAt: 'desc' }
    });

    if (!save) {
      return NextResponse.json({ gameState: null });
    }

    return NextResponse.json({ gameState: JSON.parse(save.gameState) });
  } catch (error) {
    console.error("Load error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
