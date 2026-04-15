import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "../db";
import {
  users,
  userroles,
  roles,
  rolepermissions,
  permissions,
} from "../db/schema";
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
      permissions: string[];
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface User {
    id: string;
    role: string;
    permissions: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    permissions: string[];
  }
}

/**
 * Fetches the role name and permission names for a given user ID.
 * Joins: _userroles → roles → _rolepermissions → permissions
 */
async function fetchUserRoleAndPermissions(userId: number) {
  // Get the user's role via _userroles → roles
  const userRoleRows = await db
    .select({ roleName: roles.name, roleId: roles.id })
    .from(userroles)
    .innerJoin(roles, eq(userroles.a, roles.id))
    .where(eq(userroles.b, userId))
    .limit(1);

  if (userRoleRows.length === 0) {
    return { role: "user", permissions: [] as string[] };
  }

  const userRole = userRoleRows[0];

  // Get the permissions for this role via _rolepermissions → permissions
  const permissionRows = await db
    .select({ permissionName: permissions.name })
    .from(rolepermissions)
    .innerJoin(permissions, eq(rolepermissions.a, permissions.id))
    .where(eq(rolepermissions.b, userRole.roleId));

  return {
    role: userRole.roleName,
    permissions: permissionRows.map((row) => row.permissionName),
  };
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
        let userRecord = await db
          .select()
          .from(users)
          .where(eq(users.email, identifier))
          .limit(1);
        if (userRecord.length === 0) {
          userRecord = await db
            .select()
            .from(users)
            .where(eq(users.username, identifier))
            .limit(1);
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

        // Fetch role and permissions from the database
        const { role, permissions } = await fetchUserRoleAndPermissions(
          user.id
        );

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role,
          permissions,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.permissions = token.permissions;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
