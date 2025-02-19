"use client";

import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import Navbar from "@/components/Navbar";
function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchMessages = useCallback(
    async (refresh = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );
  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
  }, [session, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({ title: "Updated successfully" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) return <div></div>;

  const { username } = session.user as User;
  const profileUrl = `${window.location.protocol}//${window.location.host}/u/${username}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      <div className="my-8 mx-auto p-8 bg-gray-800/40 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-700">
        <h1 className="text-4xl font-extrabold text-gray-200 mb-6">
          Dashboard
        </h1>

        {/* Profile Link Section */}
        <div className="mb-6 bg-gray-900/50 p-4 rounded-lg shadow-md border border-gray-700">
          <h2 className="text-xl font-semibold text-gray-300 mb-3">
            Copy Your Link
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="flex-1 p-2 text-gray-300 bg-gray-800 rounded-lg border border-gray-600 focus:outline-none min-w-0"
            />
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                onClick={() => navigator.clipboard.writeText(profileUrl)}
                className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-lg transition-all transform hover:scale-105 w-full sm:w-auto"
              >
                Copy
              </Button>
              <Button
                onClick={() => (window.location.href = profileUrl)}
                className="bg-blue-700 hover:bg-blue-600 text-white rounded-lg shadow-lg transition-all transform hover:scale-105 w-full sm:w-auto"
              >
                Go to Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Message Acceptance Toggle */}
        <div className="flex items-center bg-gray-900/50 p-4 rounded-lg shadow-md border border-gray-700">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-3 text-gray-300">
            Accept Messages: <strong>{acceptMessages ? "On" : "Off"}</strong>
          </span>
        </div>

        <Separator className="my-6 border-gray-600" />

        {/* Refresh Messages Button */}
        <Button
          className="mt-4 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          Refresh
        </Button>

        {/* Messages List */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={(id) =>
                  setMessages(messages.filter((m) => m._id !== id))
                }
              />
            ))
          ) : (
            <p className="text-center text-gray-400">No messages to display.</p>
          )}
        </div>
      </div>
      <footer className="text-center p-4 md:p-6 bg-gradient-to-r from-gray-900 to-gray-700 text-gray-300 border-t border-gray-600 shadow-inner">
        © 2025 True Suggestion. All rights reserved.
      </footer>
    </div>
  );
}
export default UserDashboard;
