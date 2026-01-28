import { NextRequest, NextResponse } from "next/server";
import { Course_config_prompt } from "../../../data/prompt";
import { coursesTable } from "@/config/schema";
import { db } from "@/config/db";
import { currentUser } from "@clerk/nextjs/server";

/* ================= JSON SAFE PARSER ================= */
function safeJSONParse(text: string) {
  try {
    if (!text || typeof text !== "string") return null;

    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // 1️⃣ Try direct JSON
    try {
      return JSON.parse(cleaned);
    } catch {}

    // 2️⃣ Try array extraction
    const arrStart = cleaned.indexOf("[");
    const arrEnd = cleaned.lastIndexOf("]");
    if (arrStart !== -1 && arrEnd !== -1) {
      return JSON.parse(cleaned.slice(arrStart, arrEnd + 1));
    }

    // 3️⃣ Try object extraction
    const objStart = cleaned.indexOf("{");
    const objEnd = cleaned.lastIndexOf("}");
    if (objStart !== -1 && objEnd !== -1) {
      return JSON.parse(cleaned.slice(objStart, objEnd + 1));
    }

    return null;
  } catch {
    return null;
  }
}

/* ================= POST ROUTE ================= */
export async function POST(req: NextRequest) {
  try {
    const { userInput, courseId, type } = await req.json();
    const user = await currentUser();

    /* ---------- VALIDATION ---------- */
    if (!userInput || !userInput.trim()) {
      return NextResponse.json({ error: "userInput required" }, { status: 400 });
    }

    if (!courseId || !type) {
      return NextResponse.json(
        { error: "courseId and type required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "AI key missing" },
        { status: 503 }
      );
    }

    /* ---------- PROMPT ---------- */
    const finalPrompt = `
${Course_config_prompt}

Course Type: ${type}
Course Topic: ${userInput}

RULES:
- Return ONLY valid JSON
- No markdown
- No explanation
`;

    /* ---------- AI CALL ---------- */
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
          model: "meta-llama/llama-3-70b-instruct",
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content:
                "You are a strict JSON generator. Output ONLY valid JSON.",
            },
            {
              role: "user",
              content: finalPrompt,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenRouter Error:", err);
      return NextResponse.json(
        { error: "AI service failed" },
        { status: 503 }
      );
    }

    const data = await response.json();
    const aiText = data?.choices?.[0]?.message?.content;

    console.log("AI RAW OUTPUT:", aiText);

    if (!aiText) {
      return NextResponse.json(
        { error: "Empty AI response", debug: data },
        { status: 200 } // ❗ DO NOT BREAK FRONTEND
      );
    }

    const parsed = safeJSONParse(aiText);

    if (!parsed) {
      return NextResponse.json(
        {
          error: "AI formatting issue",
          raw: aiText,
        },
        { status: 200 } // ❗ NO MORE 422
      );
    }

    /* ---------- COURSE NAME ---------- */
    let courseName = userInput;

    if (Array.isArray(parsed) && parsed[0]?.title) {
      courseName = parsed[0].title;
    } else if (parsed.courseName) {
      courseName = parsed.courseName;
    }

    /* ---------- DB INSERT ---------- */
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

    return NextResponse.json(
      {
        course: courseResult[0],
        aiContent: parsed,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Server Crash:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
