import React from "react";
import { Link, Button } from "@heroui/react";

interface AuthLayoutProps {
  title: string;
  subheading: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subheading,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen p-5">
      <div className="group mt-10 max-w-2xl w-full grid grid-cols-12 space-x-8 overflow-hidden rounded-md border py-8 text-white shadow transition hover:shadow-lg duration-300 bg-transparent animate-border-run">
        <div className="col-span-12 mx-2 flex flex-col pr-8 pl-4 text-left">
          <h3 className="text-sm text-pink-500">{subheading}</h3>
          <h1 className="mb-3 text-lg font-semibold sm:text-xl text-white">
            {title}
          </h1>
          {children}
          <div className="mt-5 flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 text-sm text-gray-400">
            <p>
              {footerText}{" "}
              <Link
                href={footerLinkHref}
                className="text-blue-400 hover:underline"
              >
                {footerLinkText}
              </Link>
            </p>
            <Link href="/">
              <Button className="bg-gray-600 text-white py-1 px-3 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300">
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
