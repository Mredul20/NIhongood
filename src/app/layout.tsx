import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "NIhongood — Learn Japanese the Smart Way",
  description: "Master Japanese with spaced repetition, kana charts, vocabulary, grammar, and gamified progress tracking. JLPT N5 & N4 preparation made fun.",
  keywords: ["Japanese", "JLPT", "learn Japanese", "hiragana", "katakana", "SRS", "flashcards"],
  manifest: "/manifest.json",
  themeColor: "#ff4b8b",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NIhongood",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
        {/* Inline script to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('nihongood-theme');
                  var theme = stored ? JSON.parse(stored).state.theme : 'system';
                  var resolved = theme;
                  if (theme === 'system') {
                    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(resolved);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
