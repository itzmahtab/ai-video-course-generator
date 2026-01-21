import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";
import Image from "next/image";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import CourseList from "./_components/CourseList";
import GradientBackground from "./_components/GradientBackground";
export default function Home() {
  return (
    <div>
      <Hero />
      <CourseList />

    <GradientBackground />
    </div>
  );
}
