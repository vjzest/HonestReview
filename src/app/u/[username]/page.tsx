"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { useCompletion } from "ai/react";
import Navbar from "@/components/Navbar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";

const specialChar = "||";
const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};
const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");
  const [isLoading, setIsLoading] = useState(false);

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete("");
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to fetch suggested messages.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-gray-900 to-gray-700">
        <div className="container mx-auto my-8 p-6 bg-gray-800/70 backdrop-blur-lg rounded-xl max-w-4xl shadow-lg border border-gray-600 text-white">
          <h1 className="text-4xl font-bold mb-6 text-center text-yellow-400">
            Public Profile Link
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-300">
                      Send Anonymous Message to @{username}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your anonymous message here"
                        className="resize-none p-4 border border-gray-500 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 text-white"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                {isLoading ? (
                  <Button disabled className="bg-yellow-400 text-black">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading || !messageContent}
                    className="bg-yellow-400 text-black hover:bg-yellow-500 transition"
                  >
                    Send It
                  </Button>
                )}
              </div>
            </form>
          </Form>

          <div className="space-y-4 my-8">
            <div className="space-y-2">
              <Button
                onClick={fetchSuggestedMessages}
                className="bg-cyan-400 text-black hover:bg-cyan-500 transition"
                disabled={isSuggestLoading}
              >
                {isSuggestLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading suggestions...
                  </>
                ) : (
                  "Suggest Messages"
                )}
              </Button>
              <p className="text-gray-300">
                Click on any message below to select it.
              </p>
            </div>
            <Card className="bg-gray-700/70 backdrop-blur-md border border-gray-500 text-white">
              <CardHeader>
                <h3 className="text-xl font-semibold text-purple-400">
                  Messages
                </h3>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                {error ? (
                  <p className="text-red-500">{error.message}</p>
                ) : (
                  parseStringMessages(completion).map((message, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="mb-2 text-black border-gray-500 hover:bg-yellow-400 hover:text-black px-4 py-2 text-left whitespace-normal break-words"
                      onClick={() => handleMessageClick(message)}
                    >
                      {message}
                    </Button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
          <Separator className="my-6 border-gray-500" />
          <div className="text-center">
            <div className="mb-4 text-gray-300">Get Your Message Board</div>
            <Link href={"/sign-up"}>
              <Button className="bg-purple-500 text-white hover:bg-purple-600 transition">
                Create Your Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
