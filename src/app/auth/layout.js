export const metadata = {
  title: {
    default: "Account",
    template: "%s | Account | Zammel",
  },
  description: "Login, register, and manage your Zammel account.",
  robots: { index: false, follow: true },
};

export default function AuthLayout({ children }) {
  return children;
}


