import type { Metadata } from "next";
import { Playfair_Display, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
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
        className={`${playfair.variable} ${ibmPlex.variable} ${jetbrains.variable} antialiased font-body`}
      >
        {children}
      </body>
    </html>
  );
}
