"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

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
    <div className="flex items-center justify-center min-h-screen p-5">
      <div className="group mt-10 max-w-2xl w-full grid grid-cols-12 space-x-8 overflow-hidden rounded-md border py-8 text-white shadow transition hover:shadow-lg duration-300 bg-transparent">
        <div className="col-span-12 mx-2 flex flex-col pr-8 pl-4 text-left">
          <h3 className="text-sm text-pink-500">Welcome Back</h3>
          <h1 className="mb-3 text-lg font-semibold sm:text-xl text-white">
            Sign In
          </h1>
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
          {error && (
            <p className="mt-4 text-center text-sm text-red-500">{error}</p>
          )}
          <div className="mt-6">
            <button
              onClick={() => handleOAuthSignIn("github")}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
            >
              Sign in with GitHub
            </button>
          </div>
          <p className="mt-5 text-sm text-gray-400 text-center">
            Don’t have an account?{" "}
            <a href="/auth/register" className="text-blue-400 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
