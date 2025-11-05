import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import ClientScreen from "@/components/clientScreen";
import ProtectedRoutes from "@/components/ProtectedRoutes";
export const metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | Admin | Zammel",
  },
  description: "Zammel admin dashboard for managing products, orders, customers, and settings.",
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      <Sidebar />
      <ClientScreen>
        <ProtectedRoutes requireAdmin={true}>
          {children}
        </ProtectedRoutes>
      </ClientScreen>
    </>
  );
}
