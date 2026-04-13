"use client";

import { Toaster } from "sonner";

export function SonnerToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          borderColor: "#E6E7E3"
        }
      }}
    />
  );
}
