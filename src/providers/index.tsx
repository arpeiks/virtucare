"use client";

import { Toaster } from "sonner";
import { ThemeProvider } from "./theme";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => (
  <ThemeProvider>
    {children}
    <Toaster richColors position="top-right" />
  </ThemeProvider>
);
