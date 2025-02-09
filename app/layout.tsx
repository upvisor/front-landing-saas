import type { Metadata } from "next"
import "./globals.css"
import localFont from 'next/font/local'
import Providers from "@/components/Providers"
import MainLayout from "@/components/layout/MainLayout"
import Script from "next/script"

const myFont = localFont({
  src: './fonts/Montserrat-VariableFont_wght.ttf',
  display: 'swap',
})


export const metadata: Metadata = {
  title: {
    default: 'Upvisor',
    template: '%s | Upvisor'
  },
  description: "Desarrollo de sitios webs.",
  twitter: {
    card: 'summary_large_image'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={myFont.className}>
      <head>
        <link rel="icon" href={process.env.NEXT_PUBLIC_FAVICON} />
      </head>
      <body className="overflow-x-hidden">
        <Providers>
          <MainLayout>
            <Script
              id="pixel"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}');
                  fbq('track', 'PageView')
                `,
              }}
            />
            <main>{children}</main>
          </MainLayout>
        </Providers>
      </body>
    </html>
  )
}
