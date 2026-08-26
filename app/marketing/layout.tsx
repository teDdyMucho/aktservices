import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketing Ads | AKT Virtual Assistance Services",
  description:
    "Watch AKT's latest marketing ads, promo videos, and campaign creatives — GoHighLevel builds, AI voice agents, automation, and Filipino virtual assistant services.",
  openGraph: {
    title: "Marketing Ads | AKT Virtual Assistance Services",
    description:
      "AKT's latest promos, product videos, and campaign creatives for AI automation and VA services.",
    url: "https://aktservices.org/marketing",
    siteName: "AKT Virtual Assistance Services",
    type: "website",
    images: [
      {
        url: "https://aktservices.org/image/akt_og.png",
        width: 1200,
        height: 630,
        alt: "AKT Marketing Ads",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marketing Ads | AKT",
    description: "AKT's latest promos, product videos, and campaign creatives.",
    images: ["https://aktservices.org/image/akt_og.png"],
  },
  alternates: { canonical: "https://aktservices.org/marketing" },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
