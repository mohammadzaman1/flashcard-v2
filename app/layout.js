import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs"
import Script from 'next/script'
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FlashCraft AI",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-7QPHPP6Q3F"></Script>
        <Script id="g-analytics">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-7QPHPP6Q3F');
          `}
        </Script>

        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}




