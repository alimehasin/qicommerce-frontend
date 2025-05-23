import "@/styles/globals.css";

import { Header } from "@/components/header";
import type { Metadata } from "next";
import { ClientProviders } from "./client-providers";
import { ThemeProvider } from "./theme-provider";

export const metadata: Metadata = {
  title: "QiCommerce",
  description: "QiCommerce Frontend | Find the best products for you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientProviders>
          <ThemeProvider
            enableSystem
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
          >
            <Header />

            <main className="container mx-auto py-6">{children}</main>
          </ThemeProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
