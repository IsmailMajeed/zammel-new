import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import ClientScreen from "@/components/clientScreen";
export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      <Sidebar />
      <ClientScreen>
        {children}
      </ClientScreen>
    </>
  );
}
