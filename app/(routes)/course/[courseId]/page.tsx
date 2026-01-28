"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

import CourseInfoCard from "../../_components/CourseInfoCard";
import CourseChapter from "../../_components/CourseChapter";
import { Course } from "@/type/CourseType";
import { toast } from "sonner";

function CoursePreview() {
  const { courseId } = useParams();
  const [courseDetail, setCourseDetail] = useState<Course | undefined>(undefined);

  useEffect(() => {
    if (courseId) {
      getCourseDetail();
    }
  }, [courseId]);

  const getCourseDetail = async () => {
    const loadingToast = toast.loading("Loading course details...");
    try {
      const result = await axios.get(`/api/course?courseId=${courseId}`);
      console.log("API result:", result.data);

      const course: Course = result.data.course;
      const chapterSlides = result.data.chapterSlides;

      setCourseDetail(course);
      toast.success("Course details loaded successfully!", {
        id: loadingToast,
      });

      // ✅ Safe condition
      if (
        chapterSlides?.length === 0 &&
        course?.courselayout?.chapters?.length > 0
      ) {
        await GenerateVideoContent(course);
      }
    } catch (error) {
      console.error("Failed to fetch course:", error);
      toast.error("Failed to load course details", { id: loadingToast });
    }
  };

  const GenerateVideoContent = async (course: Course) => {
    const chapters = course?.courselayout?.chapters ?? [];

    for (let i = 0; i < chapters.length; i++) {
      

      // 🧪 testing only first chapter
      if (i > 0) break;
     const toastLoading = toast.loading(
        `Generating video content for chapter ${i + 1}...`
      );
      try {
        const result = await axios.post(`/api/generate-video-content`, {
          chapter: chapters[i],
          courseId: course.courseId,
        });

        console.log("Video content generation result:", result.data);

        toast.success(
          `Video content generated successfully for chapter ${i + 1}`,
          { id: toastLoading }
        );
      } catch (error) {
        console.error("Video generation failed:", error);
        toast.error("Failed to generate video content", {
          id: toastLoading,
        });
      }
    }
  };


  return (
    <div className="flex flex-col items-center w-full">
      <CourseInfoCard course={courseDetail} />
      <CourseChapter course={courseDetail} />
    </div>
  );
}

export default CoursePreview;
