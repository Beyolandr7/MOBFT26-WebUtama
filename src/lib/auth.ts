import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email/NRP is required"),
  password: z.string().min(1, "Password is required"),
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface User {
    id: string;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email / NRP", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          throw new Error("Invalid input");
        }

        const { identifier, password } = parsed.data;

        // Find user by email or username (NRP)
        let userRecord = await db.select().from(users).where(eq(users.email, identifier)).limit(1);
        if (userRecord.length === 0) {
          userRecord = await db.select().from(users).where(eq(users.username, identifier)).limit(1);
        }

        if (userRecord.length === 0) {
          return null;
        }

        const user = userRecord[0];

        // Ensure user has a valid password hash
        if (!user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        // Return user with mocked role for demonstration since schema doesn't have a direct user_roles junction yet.
        // In a real app, you'd join with the roles table.
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: "user", // To be replaced with actual DB lookup if needed
        } as User;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: ".ubayamobft.com",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
