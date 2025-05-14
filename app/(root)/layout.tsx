import React, { PropsWithChildren } from "react";

type Props = {};

const RootLayout = ({ children }: PropsWithChildren) => {
  return <div>{children}</div>;
};

export default RootLayout;
