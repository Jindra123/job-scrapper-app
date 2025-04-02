"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import { addToast, Button } from "@heroui/react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    try {
      
      e.preventDefault();
      
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      // Using Toasts for error message and successful message
      if (res?.error) {
        addToast({
          title: "Sign-in error",
          description: res.error,
          color: "danger"
        });
      } else {
        addToast({
          title: "Login successful",
          color: "success"
        });
        router.push("/");
      }
      // Handle error if sign-in fails
    } catch (error) {
      console.error("Error during sign-in:", error);
      addToast({
        title: "Sign-in error",
        description: "An unexpected error occurred. Please try again later.",
        color: "danger"
      });
    }
  };

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <AuthLayout
      title="Sign In"
      subheading="Welcome Back"
      footerText="Don’t have an account?"
      footerLinkText="Register"
      footerLinkHref="/auth/register"
    >
      <form onSubmit={handleCredentialsSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm text-gray-400">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="mt-1 block w-full outline-none bg-transparent text-[#f2f2f2] text-sm border-b border-gray-700 py-2 focus:border-purple-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm text-gray-400">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            className="mt-1 block w-full outline-none bg-transparent text-[#f2f2f2] text-sm border-b border-gray-700 py-2 focus:border-purple-500"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300"
        >
          Sign In with Email
        </Button>
      </form>
      <div className="mt-6">
        <Button
          onPress={() => handleOAuthSignIn("github")}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
        >
          Sign in with GitHub
        </Button>
      </div>
    </AuthLayout>
  );
}
