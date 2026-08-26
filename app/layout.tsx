import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://property-listings.satyamdontul.chatgpt.site"),
  title: "Shruti Estate Consultant",
  description: "Homes and commercial properties for rent and sale across Dahisar, Borivali and Kandivali, with trusted local guidance.",
  icons: { icon: "/shruti-estate-logo.png", shortcut: "/shruti-estate-logo.png", apple: "/shruti-estate-logo.png" },
  openGraph: { title: "Shruti Estate Consultant", description: "Homes for rent and sale across Dahisar, Borivali and Kandivali, backed by trusted local guidance.", type: "website", images:[{url:"/og.png",width:1200,height:628,alt:"Shruti Estate Consultant — Property services across Dahisar, Borivali and Kandivali"}] },
  twitter: { card:"summary_large_image", title:"Shruti Estate Consultant", description:"Homes for rent and sale across Dahisar, Borivali and Kandivali, backed by trusted local guidance.", images:["/og.png"] },
};

export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
