"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/");
    }
  };

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-secondary dark:bg-gray-900">
      <Navbar />
      <main className="max-w-md mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden mt-20 dark:bg-gray-800">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-text text-center dark:text-white">
              Welcome Back
            </h1>
            <p className="text-sm text-text-light text-center mb-8 dark:text-gray-300">
              Sign in to access your account.
            </p>

            {error && (
              <div className="bg-destructive bg-opacity-10 text-destructive px-4 py-3 rounded-md my-4">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleCredentialsSubmit} className="space-y-6">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email Address"
                className="w-full px-3 py-2 text-text bg-secondary border border-secondary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full px-3 py-2 text-text bg-secondary border border-secondary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-secondary-dark dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-text-light dark:bg-gray-800 dark:text-gray-300">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => handleOAuthSignIn("github")}
                className="w-full flex justify-center items-center py-2 px-4 border border-secondary-dark rounded-md shadow-sm bg-white text-sm font-medium text-text hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:text-white"
              >
                {/* Add a GitHub icon here if you have one */}
                Sign in with GitHub
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-text-light dark:text-gray-300">
              Don’t have an account?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-primary hover:text-primary-light"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
