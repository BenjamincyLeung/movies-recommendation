import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const movie = await prisma.films.findUnique({
    where: { id: parseInt(id) },
  });

  return NextResponse.json({ movie });
}
