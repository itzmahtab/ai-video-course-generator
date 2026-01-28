import { db } from "@/config/db";
import { chapterContentSlidesTable } from "@/config/schema";
import { VideoSlideDummy } from "@/data/Dummy";
import { Generate_Video_Prompt } from "@/data/prompt";
import { utapi } from "@/lib/uploadthing";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { chapter, courseId } = await req.json();

  if (!chapter) {
    return NextResponse.json(
      { error: "Chapter data is required" },
      { status: 400 }
    );
  }

  // ---------------- AI PART (UNCHANGED / COMMENTED) ----------------

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
          messages: [
            {
              role: "system",
              content: "You are a strict JSON generator. Output ONLY valid JSON.",
            },
            { role: "user", content: Generate_Video_Prompt },
            { role: "user", content: "Chapter Details:" + JSON.stringify(chapter) },
          ],
          temperature: 0.3,
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "AI provider failed" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const aiText = data?.choices?.[0]?.message?.content;

    if (!aiText) {
      return NextResponse.json(
        { error: "Empty AI response" },
        { status: 500 }
      );
    }

    const VideoContentJSON = JSON.parse(aiText?.replace(/\n/g, "") || "{}");

  // ---------------- DUMMY DATA (UNCHANGED) ----------------

  // const VideoContentJSON = VideoSlideDummy[0];
  let audioFileURL: string[] = [];

  for (let i = 0; i < VideoContentJSON?.length; i++) {
    if (i > 0) break; // 🧪 testing only first slide

    const narrationText = VideoContentJSON[i].narration.fullText;

    try {
      const fonadaResponse = await axios.post(
        "https://api.fonada.ai/tts/generate-audio-large",
        {
          input: narrationText,
          voice: "Vaanee",
          language: "English",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.FONADA_API_KEY}`,
          },
          responseType: "arraybuffer",
          timeout: 60000,
        }
      );

      const audioBuffer = Buffer.from(fonadaResponse.data);

      console.log(audioBuffer);

      // ✅ Call UploadThing function
      const audioUrl = await uploadAudioToUploadThing(
        audioBuffer,
        VideoContentJSON[i].audioFileName
      );

      console.log("✅ Audio uploaded:", audioUrl);
      audioFileURL.push(audioUrl);

      // ---------------- ✅ FIX: DB SAVE MOVED HERE ----------------
      const result = await db.insert(chapterContentSlidesTable).values({
        chapterId: chapter.chapterId,
        courseId: courseId,
        slideIndex: VideoContentJSON[i].slideIndex,
        slideId: VideoContentJSON[i].slideId,
        audioFileName: VideoContentJSON[i].audioFileName,
        audioFileURL: audioUrl, // ✅ never null
        narration: VideoContentJSON[i].narration,
        html: VideoContentJSON[i].html,
      }).returning();

      console.log("DB Insert Result:", result);
      // ------------------------------------------------------------

    } catch (err: any) {
      console.error(
        `❌ TTS failed for scene ${i + 1}:`,
        err.message
      );
    }
  }

  return NextResponse.json({
    ...VideoContentJSON,
    audioFileURL,
  });
}

/**
 * Upload audio buffer to UploadThing
 */
async function uploadAudioToUploadThing(
  audioBuffer: Buffer,
  fileName: string
): Promise<string> {
  const audioFile = new File(
    [new Uint8Array(audioBuffer)],
    fileName,
    { type: "audio/mpeg" }
  );

  const uploadResult = await utapi.uploadFiles(audioFile);

  if (uploadResult.error) {
    throw new Error(uploadResult.error.message);
  }

  return uploadResult.data.url;
}
