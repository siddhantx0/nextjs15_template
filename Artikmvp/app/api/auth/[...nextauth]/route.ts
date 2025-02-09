/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
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
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
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
		async signIn({ user, account, profile }) {
			if (account?.provider === "google") {
				const existingUser = await prisma.user.findUnique({
					where: { email: user.email! },
					include: { accounts: true },
				});

				// If user exists and has no Google account linked
				if (existingUser && !existingUser.accounts.length) {
					// Link the Google account to the existing user
					await prisma.account.create({
						data: {
							userId: existingUser.id,
							type: account.type,
							provider: account.provider,
							providerAccountId: account.providerAccountId,
							access_token: account.access_token,
							token_type: account.token_type,
							scope: account.scope,
							id_token: account.id_token,
						},
					});
					return true;
				}
			}
			return true;
		},
		async session({ session, token }) {
			if (session?.user) {
				session.user.id = token.id as string;
			}
			return session;
		},
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
	},
	pages: {
		signIn: "/login",
		error: "/auth/error", // Add this line
	},
	session: {
		strategy: "jwt",
	},
	debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
