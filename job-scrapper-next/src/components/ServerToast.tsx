//This component enables using Toasts in server-side components
"use client";

import { useEffect } from "react";
import { addToast } from "@heroui/react";

interface ServerToastProps {
  title: string;
  description: string;
  color: "danger" | "success" | "warning" | "primary";
}

const ServerToast: React.FC<ServerToastProps> = ({ title, description, color }) => {
  useEffect(() => {
    addToast({ title, description, color });
  }, [title, description, color]);

  return null; // This component does not render anything in the DOM
};

export default ServerToast;