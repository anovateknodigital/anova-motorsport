import type { Metadata } from "next";
import { Inter, Teko } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const teko = Teko({
  variable: "--font-teko",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anova Motorsport",
  description: "Penyelenggara event balap resmi di bawah naungan IMI. The Home of Speed & Precision.",
  openGraph: {
    title: "Anova Motorsport",
    description: "Penyelenggara event balap resmi di bawah naungan IMI. Bergabunglah dengan ratusan pembalap lainnya.",
    url: "https://anovamotorsport.com",
    siteName: "Anova Motorsport",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anova Motorsport",
    description: "Penyelenggara event balap resmi di bawah naungan IMI.",
  },
  icons: {
    icon: "/anova-motorsport-logo.png",
    shortcut: "/anova-motorsport-logo.png",
    apple: "/anova-motorsport-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body
        className={`${inter.variable} ${teko.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
