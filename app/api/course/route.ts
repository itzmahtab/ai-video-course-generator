import { db } from "@/config/db";
import { coursesTable, chapterContentSlidesTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const courseId = req.nextUrl.searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json(
      { error: "courseId is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch course
    const [course] = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.courseId, courseId));

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Fetch chapter slides
    const chapterSlides = await db
      .select()
      .from(chapterContentSlidesTable)
      .where(eq(chapterContentSlidesTable.courseId, courseId));

    // Unified response
    return NextResponse.json({
      course,
      chapterSlides,
    });

  } catch (error) {
    console.error("GET /api/course error:", error);
    return NextResponse.json(
      { error: "Failed to fetch course data" },
      { status: 500 }
    );
  }
}
