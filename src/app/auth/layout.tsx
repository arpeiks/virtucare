import { AuthLayout } from "@/containers/auth/layout";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => (
  <AuthLayout>{children}</AuthLayout>
);

export default Layout;
