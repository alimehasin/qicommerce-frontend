import "@/styles/globals.css";

import { Toaster } from "@/components/ui/sonner";
import { getToken } from "@/server/actions";
import type { Metadata } from "next";
import { Config } from "./config";
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
  const token = await getToken();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}

          <Toaster />
          <Config token={token} />
        </Providers>
      </body>
    </html>
  );
}
