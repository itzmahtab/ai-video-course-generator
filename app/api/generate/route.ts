import { NextRequest, NextResponse } from "next/server";
import { Course_config_prompt } from "../../../data/prompt";
import { coursesTable } from "@/config/schema";
import { db } from "@/config/db";
import { currentUser } from "@clerk/nextjs/server";

// ---------- helper ----------
function safeJSONParse(text: string) {
  try {
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

// ---------- route ----------
export async function POST(req: NextRequest) {
  try {
    const { userInput, courseId, type } = await req.json();
    const user = await currentUser();

    if (!userInput || !userInput.trim()) {
      return NextResponse.json(
        { error: "userInput is required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "AI provider not configured" },
        { status: 503 }
      );
    }

    const finalPrompt = `
${Course_config_prompt}

Course Type: ${type}
Course Topic: ${userInput}

Return ONLY valid JSON.
No markdown.
No explanation.
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "AI Course Generator",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct",
          messages: [{ role: "user", content: finalPrompt }],
          temperature: 0.4,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenRouter Error:", err);
      return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
    }

    const data = await response.json();
    const aiText = data.choices?.[0]?.message?.content;

    const parsed = safeJSONParse(aiText);

    // If AI returned invalid JSON, stop here
    if (!parsed) {
      return NextResponse.json(
        { error: "AI returned invalid JSON", raw: aiText },
        { status: 422 }
      );
    }

    // Determine courseName safely
    let courseName = "Untitled Course";

    if (Array.isArray(parsed) && parsed.length > 0) {
      // Use first slide title if available
      courseName = parsed[0]?.title || userInput;
    } else if (parsed.courseName) {
      courseName = parsed.courseName;
    } else {
      // Fallback to user input
      courseName = userInput;
    }

    // Save course to DB
    const courseResult = await db
      .insert(coursesTable)
      .values({
        userId: user?.primaryEmailAddress?.emailAddress || "",
        courseId,
        courseName,
        userInput,
        type,
        courselayout: parsed,
      })
      .returning();

    return NextResponse.json({ course: courseResult[0], aiContent: parsed }, { status: 200 });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
