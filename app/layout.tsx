import type { Metadata } from "next";
import { Kanit, Sarabun } from "next/font/google";
import { ThemeProvider } from "../components/ThemeProvider";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["thai", "latin"],
  display: "swap",
});

const sarabun = Sarabun({
  variable: "--font-sarabun",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "สุ่มอาหาร - วันนี้กินอะไรดี?",
  description:
    "เว็บสุ่มอาหารจานโปรดทีละเมนู เลือกหมวดหมู่ได้หลากหลาย พร้อมระบบเพิ่ม แก้ไข ลบเมนูอาหารสำหรับทุกคน",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`${kanit.variable} ${sarabun.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col font-body">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

