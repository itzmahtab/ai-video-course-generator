"use client";

import React from "react";
import Image from "next/image";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

function Header() {
  const { user } = useUser();

  return (
    <div className="flex items-center shadow-black justify-between p-4 sticky top-0 z-20 transition-all duration-500 ease-in-out ">
      {/* Logo */}
      <div className="flex gap-2 items-center animate-fade-in">
        <Image
          src={"/logo.png"}
          alt="Logo"
          width={45}
          height={50}
          className="transition-transform duration-300 ease-in-out hover:scale-110"
        />
        <h2 className="text-xl font-bold transition-transform duration-300 ease-in-out hover:scale-105">
          <span className="text-xl text-blue-500">VID</span>Generator
        </h2>
      </div>

      {/* Navigation */}
      <ul className="flex space-x-6">
        <li className="text-lg font-medium cursor-pointer transition-colors duration-300 ease-in-out hover:text-blue-600 hover:underline hover:scale-105">
          Home
        </li>
        <li className="text-lg font-medium cursor-pointer transition-colors duration-300 ease-in-out hover:text-blue-600 hover:underline hover:scale-105">
          Pricing
        </li>
      </ul>

      {/* Auth & Theme */}
      <div className="flex gap-2 items-center">
        {user ? (
          <UserButton />
        ) : (
          <SignInButton mode="modal">
            <Button className="transition-all duration-300 ease-in-out hover:text-blue-600 hover:bg-blue-50 hover:scale-105">
              Get Started
            </Button>
          </SignInButton>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
}

export default Header;
