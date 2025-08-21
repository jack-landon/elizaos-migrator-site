"use client"
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import localFont from "next/font/local";
import { usePathname } from "next/navigation";



const NHaasFont = localFont({
  src: [
    {
      path: "../components/assets/fonts/NHhaas-thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../components/assets/fonts/NeueHaasGroteskDisplay-25XThin-Web.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../components/assets/fonts/NHhaas-light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../components/assets/fonts/NHaasGroteskDSStd-55Rg.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../components/assets/fonts/NHhaas-medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../components/assets/fonts/NHaasGroteskTXStd-75Bd.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-nhaas",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body
        className={`${NHaasFont.className} antialiased`}
      >
        <div>

        <Header />
        {children}
        </div>
        {pathname !== "/migrate" && <Footer />}
      </body>
    </html>
  );
}
