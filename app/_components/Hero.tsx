import React from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Send } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { QUICK_VIDEO_SUGGESTIONS } from '@/data/constant'

function Hero() {
  return (
    <div className="flex items-center flex-col mt-20">
      <div>
        <h2 className="text-4xl font-bold text-center">
          Learn Smarter with{" "}
          <span className="text-blue-300">AI Video Courses</span>
        </h2>
        <p className="text-lg mt-4 text-center">
          Transform your learning experience with our AI-powered video courses designed to adapt to your pace and style.
        </p>
      </div>

      <div className="grid w-full max-w-xl gap-6 mt-5 rounded-2xl">
        <InputGroup>
          <InputGroupTextarea
            data-slot="input-group-control"
            className="
              flex field-sizing-content min-h-20 w-full resize-none rounded-xl
              bg-transparent px-3 py-2.5 text-base outline-none md:text-sm
              transition-all duration-300
              focus:ring-2 focus:ring-blue-400/40
            "
            placeholder="Enter Your Course Topic..."
          />

          <InputGroupAddon align="block-end">
            <Select>
              <SelectTrigger className="w-45 transition-all duration-300 hover:scale-[1.02]">
                <SelectValue placeholder="Full Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-course">Full Course</SelectItem>
                <SelectItem value="quick-explain-video">Quick Explain Video</SelectItem>
              </SelectContent>
            </Select>

            <InputGroupButton
              size="icon-sm"
              variant="default"
              className="
                ml-auto cursor-pointer
                transition-all duration-300 ease-out
                hover:scale-110 hover:-translate-y-0.5
                hover:bg-blue-300/20
                dark:hover:bg-blue-400/20
                active:scale-95
              "
            >
              <Send />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex gap-5 max-w-3xl mt-5 flex-wrap justify-center">
        {QUICK_VIDEO_SUGGESTIONS.map((suggestion) => (
          <div
            key={suggestion.id}
            className="
              p-4 mt-4 cursor-pointer rounded-lg border
              transition-all duration-300 ease-out
              hover:-translate-y-1 hover:scale-[1.04]
              hover:shadow-md
              hover:bg-gray-200
              dark:hover:bg-neutral-800
            "
          >
            {suggestion.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Hero
