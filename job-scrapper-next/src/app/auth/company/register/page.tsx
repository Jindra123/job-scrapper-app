"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import { addToast, Button, Link } from "@heroui/react";

export default function CompanyRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [ico, setIco] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/company/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, ico }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        addToast({
          title: "Registration error",
          description: error,
          color: "danger"
        });
        throw new Error(error || "Registration failed");
      }

      addToast({
        title: "Registration successful",
        color: "success"
      });
      router.push("/auth/signin");
    } catch(error) {
      console.error("Error during registration:", error);
      addToast({
        title: "Registration error",
        description: "An unexpected error occurred. Please try again later.",
        color: "danger"
      });
    }
  };

  return (
    <AuthLayout
      title="Register as Company"
      subheading="Post Job Opportunities"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkHref="/auth/signin"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm text-gray-400">
            Company Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter company name"
            className="mt-1 block w-full outline-none bg-transparent text-[#f2f2f2] text-sm border-b border-gray-700 py-2 focus:border-purple-500"
          />
        </div>
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
            placeholder="Enter company email"
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
            placeholder="Enter password"
            className="mt-1 block w-full outline-none bg-transparent text-[#f2f2f2] text-sm border-b border-gray-700 py-2 focus:border-purple-500"
          />
        </div>
        <div>
          <label htmlFor="ico" className="block text-sm text-gray-400">
            IČO (Company ID)
          </label>
          <input
            id="ico"
            type="text"
            value={ico}
            onChange={(e) => setIco(e.target.value)}
            required
            placeholder="Enter IČO (e.g., 12345678)"
            className="mt-1 block w-full outline-none bg-transparent text-[#f2f2f2] text-sm border-b border-gray-700 py-2 focus:border-purple-500"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300"
        >
          Register Company
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-400">
        Looking for jobs?{" "}
        <Link href="/auth/register" className="text-blue-400 hover:underline">
          Register as Job Seeker
        </Link>
      </p>
    </AuthLayout>
  );
}
