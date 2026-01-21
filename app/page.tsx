import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    
    <div>
      <h1>Welcome to Ai Video Generator</h1>
      <Button className="mt-4">Get Started</Button>
      <UserButton/>
    </div>
  );
}
