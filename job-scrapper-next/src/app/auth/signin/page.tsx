"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/");
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
      error={error}
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
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300"
        >
          Sign In with Email
        </button>
      </form>
      <div className="mt-6">
        <button
          onClick={() => handleOAuthSignIn("github")}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
        >
          Sign in with GitHub
        </button>
      </div>
    </AuthLayout>
  );
}
