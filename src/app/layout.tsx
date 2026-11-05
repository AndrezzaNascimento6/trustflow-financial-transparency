import type { Metadata } from "next";
import "./globals.css";
import "./editorial.css";
import "./onboarding.css";
import "./marketing.css";
export const metadata: Metadata = { title: "TrustFlow — Your data. Your decision.", description: "An independent interactive UX concept for clarity and control in Open Finance permissions.", openGraph: { title: "TrustFlow — Your data. Your decision.", description: "An interactive financial transparency product concept.", type: "website" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
