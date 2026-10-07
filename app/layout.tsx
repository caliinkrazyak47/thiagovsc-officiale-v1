import "./globals.css";
import { Teko, Inter, Space_Mono } from "next/font/google";
import type { Viewport, Metadata } from "next";
import { Analytics } from "@/components/Analytics";

const teko = Teko({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-revoltosa-serif"
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-revoltosa-sans"
});

const spaceMono = Space_Mono({ 
  subsets: ["latin"], 
  weight: ["400", "700"],
  variable: "--font-geist-mono"
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thiagovsc.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Thiago VSC | The Influencer Experience & 24/7 Broadcast",
    template: "%s | Thiago VSC Official",
  },
  description: "Canal oficial de Thiago VSC: TV Online en 4K Ultra HD, Emisora de Radio en Vivo, TikTok Viral Feed y Cobertura de Eventos Exclusivos.",
  keywords: [
    "Thiago VSC",
    "TV Online 4K",
    "Radio en Vivo",
    "TikTok Viral Feed",
    "Influencer Madrid",
    "Música Urbana",
    "Reggaetón",
    "Shôko Madrid Eventos"
  ],
  authors: [{ name: "Thiago VSC", url: siteUrl }],
  creator: "Thiago VSC Media Network",
  publisher: "Thiago VSC Entertainment",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: "THIAGO VSC OFFICIAL NETWORK",
    title: "Thiago VSC | The Influencer Experience",
    description: "TV Online 4K Ultra HD en directo, radio streaming en vivo, feed viral y ranking de influencers.",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "Thiago VSC Official Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thiago VSC | The Influencer Experience",
    description: "Transmisión 24/7 en directo: TV Online 4K, Radio en Vivo y TikTok Feed.",
    images: ["/icon.svg"],
    creator: "@thiagovsc",
  },
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
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#09070D",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Structured Data (JSON-LD) for SEO & Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "Thiago VSC Official Network",
        "description": "Plataforma de entretenimiento con TV Online 4K, Radio en Vivo y TikTok Feed.",
        "inLanguage": "es-ES"
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        "name": "Thiago VSC",
        "jobTitle": "Creador de Contenido & Artista Audiovisual",
        "url": siteUrl,
        "sameAs": [
          "https://instagram.com",
          "https://tiktok.com",
          "https://youtube.com",
          "https://spotify.com"
        ]
      },
      {
        "@type": "BroadcastChannel",
        "@id": `${siteUrl}/#tv-channel`,
        "name": "Thiago VSC TV Online 4K",
        "broadcastServiceTier": "Free",
        "genre": ["Urban Music", "Pop", "Electronic", "Entertainment"],
        "inLanguage": "es"
      }
    ]
  };

  return (
    <html lang="es" className={`${teko.variable} ${inter.variable} ${spaceMono.variable} overflow-x-hidden`}>
      <head>
        {/* Performance Preconnects for Ultra Fast Streaming */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://playerservices.streamtheworld.com" />
        <link rel="dns-prefetch" href="https://liveaudio.lamusica.com" />

        {/* Structured Data Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="overflow-x-hidden w-full min-h-screen bg-[#09070D] antialiased">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
