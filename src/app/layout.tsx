import "./globals.css";
import Providers from "./providers";
import SiteShell from "@/components/site-shell";

export const metadata = {
  title: "InfoM4th | Where Code Meets Thinking",
  description:
    "Computer Science & Mathematics student club. Exclusive learning library, workshops, and intellectual growth.",
  openGraph: {
    title: "InfoM4th | Where Code Meets Thinking",
    description:
      "Computer Science & Mathematics student club. Exclusive learning library, workshops, and intellectual growth.",
    type: "website",
    images: ["/opengraph.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "InfoM4th | Where Code Meets Thinking",
    description:
      "Computer Science & Mathematics student club. Exclusive learning library, workshops, and intellectual growth.",
    images: ["/opengraph.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
