import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@/type/CourseType";
import { Player } from "@remotion/player";
import { Dot } from "lucide-react";
import React from "react";
import ChapterVideo from "./ChapterVideo";

type Props = {
  course: Course | undefined;
};
function CourseChapter({ course }: Props) {
  return (
    <div className="max-w-6xl -mt-5 p-10 border rounded-3xl shadow-lg w-full bg-background/80 backdrop-blur">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">Course Preview</h2>
        <h2 className="text-sm text-muted-foreground">
          Chapters and Short Preview
        </h2>
      </div>

      <div>
        {course?.courselayout.chapters.map((chapter, index) => (
          <Card className="mb-5" key={index}>
            <CardHeader>
              <div className="flex gap-3 items-center">
                <h2 className="p-2 bg-primary/20 inline-flex h-10 w-10 text-center justify-center rounded-2xl">
                  {index + 1}
                </h2>
                <CardTitle className="md:text-lg text-base">
                  {chapter.chapterTitle}
                </CardTitle>
              </div>
            </CardHeader>


            <CardContent>
                <div className="grid grid-cols-2 gap-5 ">
                      <div className="flex flex-col gap-3">
                      {chapter?.subContent &&
                     Array.isArray(chapter.subContent) &&
                      chapter.subContent.map((content: string, index: number) => (
                        <div key={index} className="flex gap-2 items-center mt-2">
                      <Dot className=" mt-1 h-5 w-5 text-primary" />
                      <h2>{content}</h2>
                    </div>
                  ))}
              </div>
              <div>
                    <Player
            component={ChapterVideo}
            durationInFrames={30}
            compositionWidth={1280}
            compositionHeight={720}
            fps={30}
            controls
            style={
              {
              width :'80%',
              height:'180px',
              aspectRatio:'16/9',

              }

            }

          />
              </div>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default CourseChapter;
