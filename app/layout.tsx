import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RaskAI.lt — AI sprendimų platforma verslui",
  description:
    "Aprašykite verslo problemą — RaskAI ją išanalizuos, suformuos sprendimo specifikaciją ir nukreips į tinkamiausią įgyvendinimo kelią.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt">
      <body
        className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable} antialiased font-body`}
      >
        {children}
      </body>
    </html>
  );
}
