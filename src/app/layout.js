import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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
  title: "ZAMMEL - Premium Hoodies Collection | First Check Then Pay",
  description: "First in Pakistan to offer open parcel delivery. Premium quality hoodies with first check then pay policy. Shop our exclusive collection of comfortable and stylish hoodies.",
  keywords: "hoodies, pakistan, premium clothing, mettwear, first check then pay, comfortable hoodies, stylish clothing",
  authors: [{ name: "ZAMMEL" }],
  creator: "ZAMMEL",
  publisher: "ZAMMEL",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mettwear.com",
    siteName: "ZAMMEL",
    title: "ZAMMEL - Premium Hoodies Collection | First Check Then Pay",
    description: "First in Pakistan to offer open parcel delivery. Premium quality hoodies with first check then pay policy.",
    images: [
      {
        url: "https://mettwear.com/cdn/shop/files/PO2_Hoodie.jpg?v=1730314234",
        width: 1200,
        height: 630,
        alt: "ZAMMEL Premium Hoodies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZAMMEL - Premium Hoodies Collection",
    description: "First in Pakistan to offer open parcel delivery. Premium quality hoodies.",
    images: ["https://mettwear.com/cdn/shop/files/PO2_Hoodie.jpg?v=1730314234"],
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://mettwear.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#222222" />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ZAMMEL",
              "url": "https://mettwear.com",
              "logo": "https://mettwear.com/cdn/shop/files/PO2_Hoodie.jpg?v=1730314234",
              "description": "First in Pakistan to offer open parcel delivery. Premium quality hoodies with first check then pay policy.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "PK"
              },
              "sameAs": [
                "https://www.facebook.com/mettwear",
                "https://www.instagram.com/mettwear"
              ]
            })
          }}
        />
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
