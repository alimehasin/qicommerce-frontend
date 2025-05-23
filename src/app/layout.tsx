import "@/styles/globals.css";

import type { Metadata } from "next";
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
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
