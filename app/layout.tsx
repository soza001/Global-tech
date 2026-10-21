import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Bonjour Soza", description: "Un petit test de conversation." };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#F7F8FA" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
