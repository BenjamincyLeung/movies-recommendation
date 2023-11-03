import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const allFilmsByCategories = await prisma.films.findFirst({
    where: {
      id: parseInt(id),
    },
  });

  return NextResponse.json(allFilmsByCategories);
}
