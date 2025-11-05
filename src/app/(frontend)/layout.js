import Layout from "@/components/Layout";

export const metadata = {
  title: {
    default: "Shop Premium Hoodies & Fashion",
    template: "%s | Zammel",
  },
  description: "Discover premium-quality hoodies and fashion. Open parcel before payment across Pakistan.",
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }) {
  return (
    <Layout>
      {children}
    </Layout>
  );
}
