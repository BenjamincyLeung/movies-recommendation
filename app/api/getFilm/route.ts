import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request: NextRequest) {
  const allFilmsByCategories = await prisma.categories.findMany({
    include: {
      films: {
        select: {
          film: true,
        },
      },
    },
  });

  return NextResponse.json(allFilmsByCategories);
}
