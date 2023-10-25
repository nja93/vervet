import { config } from "@/lib/utils/authOptions";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";

const handler = NextAuth(config) satisfies NextAuthOptions;

export { handler as GET, handler as POST };
