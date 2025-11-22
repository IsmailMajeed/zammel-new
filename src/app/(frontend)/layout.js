import Layout from "@/components/Layout";
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zammel.store';

export const metadata = {
  title: {
    default: "Shop Premium Hoodies & Fashion",
    template: "%s | Zammel",
  },
  description: "Discover premium-quality hoodies and fashion. Open parcel before payment across Pakistan.",
  alternates: { canonical: `${baseUrl}/` },
};

export default function RootLayout({ children }) {
  return (
    <Layout>
      {children}
    </Layout>
  );
}
