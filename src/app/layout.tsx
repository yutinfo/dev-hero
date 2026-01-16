import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"], 
  variable: "--font-space",
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-mono",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "devhero | Developer Tools",
  description: "Tools crafted for shipping faster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
       <body className="font-sans text-slate-200 antialiased min-h-screen">
          <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.08),transparent_25%),radial-gradient(circle_at_80%_10%,rgba(34,197,235,0.08),transparent_25%)] z-0"></div>
          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
          </div>
      </body>
    </html>
  );
}
