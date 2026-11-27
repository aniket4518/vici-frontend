import type { Metadata } from "next";

/* The page is a client component, which cannot export metadata. */
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Have questions about Daur or looking to collaborate? Reach out for any inquiries, feedback, or partnership opportunities.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
