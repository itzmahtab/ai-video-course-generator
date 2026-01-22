import { Generate_Video_Prompt } from "@/data/prompt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {chapter,courseId} = await req.json();
    //genrate json schema for video content
    
    const finalPrompt = Generate_Video_Prompt

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
          messages: [{ role: "user", content: finalPrompt },
            {role:'user',content:'Chapter Details is :'+ JSON.stringify(chapter)}
          ],
          temperature: 0.4,
        }),
      }
    );
    const data = await response.json();
    const AiResult = data.choices[0].message?.content;

    const VideoContent = JSON.parse(AiResult?.replace(/\n/g, ""));



    //audio file generation using TTs for narration

    //store audio in cloud storage and get url
    

    //Genrate caption

    //save everything in db

    //return response


    return NextResponse.json({VideoContent});
}