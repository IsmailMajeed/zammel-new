import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import ClientScreen from "@/components/clientScreen";
import ProtectedRoutes from "@/components/ProtectedRoutes";
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
