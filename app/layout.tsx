import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";


const monty = Montserrat({
  variable: "--font-monty",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Text Translator & Summarizer",
  description: "Powerd by Chromes AI API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${monty.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
