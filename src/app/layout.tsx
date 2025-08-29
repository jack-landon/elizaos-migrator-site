"use client";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { SolanaProvider } from "@/providers";
import { Toaster } from "sonner";
import { TransactionListenerProvider } from "@/providers/transaction-listener";

import localFont from "next/font/local";
import { usePathname } from "next/navigation";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

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

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en" className="h-full">
      <body className={`${NHaasFont.className} antialiased h-full`}>
        <QueryClientProvider client={queryClient}>
          <SolanaProvider>
            <TransactionListenerProvider>
              <div className="h-full flex flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                {pathname !== "/migrate" && <Footer />}
              </div>
              <Toaster />
            </TransactionListenerProvider>
          </SolanaProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
