import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "TrustFlow — Your data. Your call.", description: "An independent interactive UX concept for clarity and control in Open Finance permissions.", openGraph: { title: "TrustFlow — Your data. Your call.", description: "An interactive financial transparency product concept.", type: "website" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
