import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-assistant",
});

export const metadata: Metadata = {
  title: "דיני משפחה | לימוד עצמי",
  description: "אפליקציית לימוד עצמי בדיני משפחה בישראל",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} h-full antialiased`}>
      <body className={`${assistant.className} min-h-full bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
