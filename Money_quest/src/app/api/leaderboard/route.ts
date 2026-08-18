import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const leaderboard = await prisma.leaderboardEntry.findMany({
      take: 50,
      orderBy: { finalNetWorth: 'desc' },
      include: {
        user: {
          select: { name: true, image: true }
        }
      }
    });

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error("Leaderboard GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { finalNetWorth, highestFI } = await req.json();
    const userId = (session.user as any).id;

    const existing = await prisma.leaderboardEntry.findUnique({
      where: { userId }
    });

    if (!existing || finalNetWorth > existing.finalNetWorth) {
      await prisma.leaderboardEntry.upsert({
        where: { userId },
        update: { finalNetWorth, highestFI, completedAt: new Date() },
        create: { userId, finalNetWorth, highestFI }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Leaderboard POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
