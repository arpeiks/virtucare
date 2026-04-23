import { Header } from "./header";
import { Details } from "./details";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full grid" style={{ gridTemplateColumns: "minmax(0, 480px) 1fr" }}>
      <div className="flex flex-col px-14 py-10 min-h-screen bg-background">
        <Header />
        <div className="flex-1" />
        <div className="max-w-[380px]">{children}</div>
        <div className="flex-1" />
      </div>
      <Details />
    </div>
  );
};
