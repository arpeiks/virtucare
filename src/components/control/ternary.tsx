import { Fragment } from "react";

type TernaryProps = {
  condition: boolean;
  children: [React.ReactNode, React.ReactNode];
};

export const Ternary = ({ condition, children }: TernaryProps) => {
  const [thenChild, elseChild] = children;
  return <Fragment>{condition ? thenChild : elseChild}</Fragment>;
};
