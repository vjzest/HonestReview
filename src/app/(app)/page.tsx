"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react"; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gradient-to-b from-blue-900 to-purple-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-yellow-300">
            Honest Opinions. Zero Judgment.
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-gray-200">
            True Feedback – Say what you mean, without revealing who you are.
          </p>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          opts={{
            loop: true,
          }}
          plugins={[Autoplay({ delay: 3000 })]} // Fixed autoplay usage
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card className="w-full max-w-2xl p-6 md:p-8 bg-white/20 backdrop-blur-lg rounded-lg shadow-lg border border-white/30">
                  <CardHeader>
                    <CardTitle className="text-xl md:text-2xl text-yellow-300">
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6 text-lg text-gray-100">
                    <Mail className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 text-yellow-400" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-sm text-gray-300">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gradient-to-r from-purple-900 to-blue-700 text-white">
        © 2025 True Suggestion. All rights reserved.
      </footer>
    </>
  );
}
