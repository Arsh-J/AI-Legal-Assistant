import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "LexBrain AI",
  description: "AI Legal Assistant for India",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚖️</text></svg>",
  },
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
