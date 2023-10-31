import db from "@/lib/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { NextAuthOptions, Session, getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { NextRequest } from "next/server";

export const config = {
  adapter: DrizzleAdapter(db),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/signin",
  },

  callbacks: {
    async session({
      session,
      token,
      user,
    }: {
      session: any;
      token: any;
      user: any;
    }) {
      if (session?.user && token) {
        session.user.id = token.sub;
      }
      if (session?.user && user) {
        session.user.id = user.id;
      }
      return session;
    },

    async jwt({ user, token }: { user: any; token: any }) {
      if (user) {
        token.sub = user.id;
      }

      return token;
    },
  },
} satisfies NextAuthOptions;

// Use it in server contexts
export const auth = (
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
): Promise<Session | null> => {
  return getServerSession(...args, config);
};

export const getUserToken = (req: NextRequest) => {
  return getToken({ req, secret: process.env.NEXTAUTH_SECRET });
};
