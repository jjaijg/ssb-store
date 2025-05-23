import { auth } from "@/auth";
import React, { PropsWithChildren } from "react";
import { SessionProvider as NextSessionProvider } from "next-auth/react";

type Props = {};

const SessionProvider = async (props: PropsWithChildren) => {
  const session = await auth();
  return (
    <NextSessionProvider session={session}>
      {props.children}
    </NextSessionProvider>
  );
};

export default SessionProvider;
