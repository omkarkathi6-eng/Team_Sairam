"use client";
import { SessionProvider } from "next-auth/react";

export function SessionWrapper({ children, session }) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
