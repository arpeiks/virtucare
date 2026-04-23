import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/providers";
import { Figtree, Instrument_Serif, JetBrains_Mono } from "next/font/google";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  fallback: ["Cormorant Garamond", "ui-serif", "Georgia", "serif"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  fallback: ["ui-monospace", "SF Mono", "Menlo", "monospace"],
});

export const metadata: Metadata = {
  title: "Virtucare",
  description: "Virtucare",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html
    lang="en"
    suppressHydrationWarning
    className={`${figtree.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
  >
    <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
      <Providers>{children}</Providers>
    </body>
  </html>
);

export default RootLayout;
