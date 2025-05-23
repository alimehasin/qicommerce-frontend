import "@/styles/globals.css";

import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Providers } from "./providers/providers";

export const metadata: Metadata = {
  title: "QiCommerce",
  description: "QiCommerce Frontend | Find the best products for you",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}

          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
