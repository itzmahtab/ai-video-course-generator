"use client";

import React, { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Loader2, Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QUICK_VIDEO_SUGGESTIONS } from "@/data/constant";
import axios from "axios";
import { toast } from "sonner";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function Hero() {
  const [userInput, setUserInput] = useState("");
  const [courseType, setCourseType] = useState("full-course");
  const [loading, setLoading] = useState(false);
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const GenerateCourseLayout = async () => {
    const courseId = await crypto.randomUUID();

    if (!userInput.trim()) {
      toast.error("Please enter a course topic");
      return;
    }

    if (!isSignedIn) {
      toast.error("Please sign in to generate a course");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Generating your course layout...");

    try {
      const result = await axios.post("/api/generate", {
        userInput,
        type: courseType,
        courseId: courseId,
      });

      console.log("AI RESULT:", result.data);

      toast.success("Course layout generated!", { id: toastId });

      //go to course editor page

      router.push(`/course/${courseId}`);
    } catch (error: any) {
      console.error("Client Error:", error);

      if (error?.response?.status === 503) {
        toast.error(
          "AI service is temporarily unavailable. Please try again later.",
          { id: toastId },
        );
      } else if (error?.response?.status === 422) {
        toast.error("AI returned an invalid response. Please try again.", {
          id: toastId,
        });
      } else {
        toast.error("Something went wrong. Please try again.", { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center flex-col mt-20">
      <div>
        <h2 className="text-4xl font-bold text-center">
          Learn Smarter with{" "}
          <span className="text-blue-300">AI Video Courses</span>
        </h2>
        <p className="text-lg mt-4 text-center">
          Transform your learning experience with AI-powered video courses.
        </p>
      </div>

      {!isSignedIn && (
        <div className="mt-6 flex gap-4">
          <SignInButton>
            <button className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      )}

      <div className="grid w-full max-w-xl gap-6 mt-5 rounded-2xl">
        <InputGroup className="relative">
          <InputGroupTextarea
            className="min-h-20 w-full resize-none rounded-xl px-3 py-2.5 pr-16" // make room for button
            placeholder="Enter your course topic..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={!isSignedIn}
          />

          {/* Send Button at the end of the textarea */}
          <InputGroupButton
            size="icon-sm"
       className="
  absolute bottom-2 right-2
  transition-all duration-300 ease-out
  hover:shadow-lg hover:-translate-y-1

  bg-black text-white
  dark:bg-white dark:text-black
"

            onClick={GenerateCourseLayout}
            disabled={loading || !isSignedIn}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send />}
          </InputGroupButton>

          <InputGroupAddon align="block-end" className="mt-3">
            <Select value={courseType} onValueChange={setCourseType}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Full Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-course">Full Course</SelectItem>
                <SelectItem value="quick-explain-video">
                  Quick Explain Video
                </SelectItem>
              </SelectContent>
            </Select>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex gap-5 max-w-3xl mt-5 flex-wrap justify-center">
        {QUICK_VIDEO_SUGGESTIONS.map((suggestion) => (
          <div
            key={suggestion.id}
            onClick={() => setUserInput(suggestion.prompt)}
            className="
  p-4 mt-4 cursor-pointer rounded-lg border
  transition-all duration-300 ease-out
  hover:shadow-lg hover:-translate-y-1
"
          >
            {suggestion.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hero;
