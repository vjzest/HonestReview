"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { signInSchema } from "@/schemas/signInSchema";

export default function SignInForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      toast({
        title: "Login Failed",
        description:
          result.error === "CredentialsSignin"
            ? "Incorrect username or password"
            : result.error,
        variant: "destructive",
      });
    }

    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 bg-opacity-80 rounded-2xl shadow-[5px_5px_15px_rgba(0,0,0,0.4)] border border-gray-700 backdrop-blur-xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-100 drop-shadow-lg">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm">
            Sign in to access your dashboard
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Email/Username
                  </FormLabel>
                  <Input
                    {...field}
                    className="bg-gray-700 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-gray-500 focus:border-gray-400 rounded-lg shadow-inner transition-all transform hover:scale-[1.02]"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <Input
                    type="password"
                    {...field}
                    className="bg-gray-700 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-gray-500 focus:border-gray-400 rounded-lg shadow-inner transition-all transform hover:scale-[1.02]"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full bg-gradient-to-br from-gray-600 to-gray-400 hover:from-gray-500 hover:to-gray-300 text-white font-semibold rounded-xl shadow-lg py-2 transition-all transform hover:scale-105 active:scale-95"
              type="submit"
            >
              Sign In
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-gray-400">
            Don&#39;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-gray-300 hover:text-white hover:underline font-medium transition-all"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
