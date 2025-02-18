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
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white min-h-screen">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-200 drop-shadow-lg">
            Honest Opinions. Zero Judgment.
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-gray-300">
            True Feedback – Say what you mean, without revealing who you are.
          </p>
        </section>

        {/* Carousel for Messages */}
        <div className="relative w-full max-w-lg md:max-w-xl">
          <Carousel
            opts={{
              loop: true,
            }}
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="w-full max-w-2xl p-6 md:p-8 bg-black/30 backdrop-blur-xl border border-gray-600 shadow-2xl shadow-gray-900 rounded-xl transform transition-all hover:scale-105 hover:shadow-gray-700">
                    <CardHeader>
                      <CardTitle className="text-xl md:text-2xl text-gray-100">
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6 text-lg text-gray-300">
                      <Mail className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                      <div>
                        <p>{message.content}</p>
                        <p className="text-sm text-gray-400">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gradient-to-r from-gray-900 to-gray-700 text-gray-300 border-t border-gray-600 shadow-inner">
        © 2025 True Suggestion. All rights reserved.
      </footer>
    </>
  );
}
