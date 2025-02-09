import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
	try {
		const { username, email } = await request.json();

		// Check for existing user
		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [{ username: username }, { email: email }],
			},
		});

		if (existingUser) {
			return NextResponse.json({
				exists: true,
				message:
					existingUser.username === username
						? "Username already taken"
						: "Email already registered",
			});
		}

		return NextResponse.json({ exists: false });
	} catch (error) {
		return NextResponse.json(
			{ error: `Failed to check user; ${error}` },
			{ status: 500 }
		);
	}
}
