import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { BRAND } from "@/utils/brandConstants";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plusjakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: {
    default: "Zammel - Premium Fashion Brand",
    template: "%s | Zammel",
  },
  description: "Discover premium fashion with Zammel. Check first, then pay. Shop quality hoodies and more.",
  keywords: BRAND.meta?.keywords,
  authors: BRAND.meta?.authors,
  creator: BRAND.name,
  publisher: BRAND.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Zammel",
    title: "Zammel - Premium Fashion Brand",
    description: "Discover premium fashion with Zammel. Check first, then pay.",
    images: [
      {
        url: "/favicon_io/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Zammel Brand Icon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zammel - Premium Fashion Brand",
    description: "Discover premium fashion with Zammel. Check first, then pay.",
    images: ["/favicon_io/android-chrome-512x512.png"],
  },
  icons: {
    icon: [
      { url: "/favicon_io/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon_io/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon_io/favicon.ico", rel: "shortcut icon" },
    ],
    apple: [{ url: "/favicon_io/apple-touch-icon.png", sizes: "180x180" }],
  },
  verification: {
    google: "google-site-verification=oss8mpypPHNgCmtWXrShnphNuR6niSJSXiwEzwSp8dE",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#222222" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Zammel",
              "url": "/",
              "logo": "/favicon_io/android-chrome-512x512.png",
              "description": BRAND.meta?.description,
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "PK"
              },
              "sameAs": [
                "https://www.facebook.com/",
                "https://www.instagram.com/"
              ]
            })
          }}
        />
        <script async custom-element="amp-ad" src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"></script>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2984910822285596"
          crossOrigin="anonymous"></script>
      </head>
      <body
        className={`${manrope.variable} ${plusJakarta.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
