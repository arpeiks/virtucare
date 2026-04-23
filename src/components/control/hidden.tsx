import { Fragment } from "react";

const Hidden = ({ children, display }: { children: React.ReactNode; display?: boolean }) => {
  if (!display) return null;
  return <Fragment>{children}</Fragment>;
};

export default Hidden;
