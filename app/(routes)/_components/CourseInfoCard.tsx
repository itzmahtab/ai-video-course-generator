import { Course } from "@/type/CourseType";
import { BookOpen, ChartNoAxesColumnIncreasing, Sparkle } from "lucide-react";
import React from "react";
import {Player} from '@remotion/player'
import ChapterVideo from "./ChapterVideo";
type Props = {
  course: Course | undefined;
};


function CourseInfoCard({ course }: Props) {
  return (
    <div
      className="
        rounded-3xl
        border
        p-1
        shadow-xl
        bg-gradient-to-br
        from-sky-200 via-indigo-100 via-emerald-100 to-rose-100
        dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
      "
    >
      <div
        className="
          p-20 grid grid-cols-1 md:grid-cols-2 gap-5
          rounded-3xl
          bg-white/80
          dark:bg-black/40
          backdrop-blur-md
        "
      >
        <div>
          <h2 className="flex gap-2 p-1 px-3 border rounded-2xl inline-flex bg-white/70 dark:bg-black/40">
            <Sparkle /> Course Information
          </h2>

          <h2 className="text-4xl font-bold mt-4">
            {course?.courseName}
          </h2>

          <p className="text-lg text-muted-foreground mt-3">
            {course?.courselayout?.courseDescription}
          </p>

          <div className="mt-5 flex gap-5">
            <h2 className="px-3 p-2 border rounded-2xl flex gap-3 items-center bg-white/70 dark:bg-black/40">
              <ChartNoAxesColumnIncreasing className="text-sky-500" />
              {course?.courselayout?.level}
            </h2>

            <h2 className="px-3 p-2 border rounded-2xl flex gap-3 items-center bg-white/70 dark:bg-black/40">
              <BookOpen className=" text-emerald-500" />
              {course?.courselayout?.totalChapters} chapters
            </h2>
          </div>
        </div>

        <div className="border-2 border-white/10 rounded-2xl">
          <Player
            component={ChapterVideo}
            durationInFrames={30}
            compositionWidth={1280}
            compositionHeight={720}
            fps={30}
            controls
            style={
              {
              width :'100%',
              aspectRatio:'16/9',

              }

            }

          />
        </div>
      </div>
    </div>
  );
}



export default CourseInfoCard;
