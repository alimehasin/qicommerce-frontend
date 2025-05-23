import "@/styles/globals.css";

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
