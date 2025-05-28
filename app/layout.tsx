import type { Metadata } from "next";
import { Inter, Poppins, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-sc",
});

export const metadata: Metadata = {
  title: "Royal cargo",
  description:
    "Royal cargo, Recevez vos colis de la Chine vers la Côte d'Ivoire en sécurité et garantie. 👌🏾",
  keywords: [
    "livraison",
    "colis",
    "chine",
    "côte d'ivoire",
    "transport",
    "logistique",
  ],
  authors: [{ name: "Royal Cargo" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased bg-gray-900",
          inter.variable,
          poppins.variable
          // notoSansSC.variable
        )}
      >
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
        <main className="relative flex min-h-screen flex-col">{children}</main>
        <Toaster richColors closeButton position="top-right" />
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
