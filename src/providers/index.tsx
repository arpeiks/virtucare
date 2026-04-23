import { ThemeProvider } from "./theme";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => <ThemeProvider>{children}</ThemeProvider>;
