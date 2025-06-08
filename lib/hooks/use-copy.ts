"use client";

import { useState } from "react";
import { toast } from "sonner";

export function useCopy() {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const copyToClipboard = async (text: string, key: string, successMessage?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      toast.success(successMessage || "Copied to clipboard!");
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
      console.error("Copy failed:", error);
    }
  };

  const isCopied = (key: string) => copiedStates[key] || false;

  return { copyToClipboard, isCopied };
} 