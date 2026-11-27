import type { Metadata } from "next";

/* The page is a client component, which cannot export metadata. */
export const metadata: Metadata = {
  title: "About",
  description:
    "Daur turns every walk and run into a territory war. Claim hex zones, complete quests, and climb the leaderboard — all by simply moving.",
  alternates: { canonical: "/about" },
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
