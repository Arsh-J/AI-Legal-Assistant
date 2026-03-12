import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "LexBrain AI — Indian Legal Intelligence",
  description: "AI-powered Indian legal analysis. IPC sections, outcome prediction, and professional reports in seconds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#161B26",
              color: "#C8D3E0",
              border: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "'Syne', sans-serif",
              fontSize: 14,
              borderRadius: 10,
            },
            success: { iconTheme: { primary: "#4ADE80", secondary: "#161B26" } },
            error:   { iconTheme: { primary: "#E05252", secondary: "#161B26" } },
          }}
        />
        {children}
      </body>
    </html>
  );
}
