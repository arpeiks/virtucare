import { Header } from "./header";
import { Details } from "./details";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full lg:grid lg:[grid-template-columns:minmax(0,480px)_1fr]">
      <div className="flex flex-col px-6 sm:px-10 lg:px-14 py-8 sm:py-10 min-h-screen bg-background">
        <Header />
        <div className="flex-1" />
        <div className="w-full max-w-[380px] mx-auto lg:mx-0">{children}</div>
        <div className="flex-1" />
      </div>
      <Details />
    </div>
  );
};
