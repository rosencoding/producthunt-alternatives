import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Scripts from "@/components/scripts";
import { directoryCount } from "@/lib/directories";
import { DATA_YEAR, SITE_URL } from "@/lib/hubs";

const title = `Product Hunt Alternatives: ${directoryCount} Launch Sites (${DATA_YEAR})`;
const description =
    `Compare ${directoryCount} Product Hunt alternatives by audience, Domain Rating, and link type. Find your next launch platform or let LaunchDirectories submit for you.`;

const inter = localFont({
    src: "./fonts/inter-latin.woff2",
    variable: "--font-inter",
    display: "swap",
    weight: "100 900",
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: title,
        template: "%s | Product Hunt Alternatives",
    },
    description,
    alternates: {
        canonical: "/",
        types: { "text/markdown": "/index.md" },
    },
    openGraph: {
        title,
        description,
        url: SITE_URL,
        siteName: "Product Hunt Alternatives",
        images: [
            {
                url: "/og.png",
                width: 1200,
                height: 630,
                alt: "Product Hunt Alternatives",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/og.png"],
    },
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "48x48" },
            { url: "/favicon.svg", type: "image/svg+xml" },
            { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
        ],
        apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.variable} antialiased`}
            >
                {children}
            </body>
            <Scripts />
        </html>
    );
}
