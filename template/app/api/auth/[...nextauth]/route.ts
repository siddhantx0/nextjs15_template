/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter as PA } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			username?: string | null;
		} & DefaultSession["user"];
	}

	interface User extends DefaultUser {
		username?: string | null;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		username?: string | null;
	}
}

export const authOptions: AuthOptions = {
	adapter: PA(prisma),
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				login: { label: "Username or Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.login || !credentials?.password) {
					return null;
				}

				try {
					// Find user by either username or email
					const user = await prisma.user.findFirst({
						where: {
							OR: [
								{ email: credentials.login },
								{ username: credentials.login },
							],
						},
					});

					if (!user || !user.password) {
						console.log("No user found or no password");
						return null;
					}

					const passwordMatch = await bcrypt.compare(
						credentials.password,
						user.password
					);

					if (!passwordMatch) {
						console.log("Password doesn't match");
						return null;
					}

					// Return user object without password
					const { password: _, ...userWithoutPassword } = user;
					console.log("Login successful for user:", userWithoutPassword);

					return userWithoutPassword;
				} catch (error) {
					console.error("Auth error:", error);
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.username = user.username;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id;
				session.user.username = token.username;
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
	secret: process.env.NEXTAUTH_SECRET,
	debug: process.env.NODE_ENV === "development", // Enable debug messages
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
