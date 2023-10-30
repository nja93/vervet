import db from "@/lib/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

type ISODateString = string;
export interface DefaultSession {
  user?: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires: ISODateString;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export const config = {
  adapter: DrizzleAdapter(db),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async session({ session, user }: { session: DefaultSession; user: User }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
};

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}
