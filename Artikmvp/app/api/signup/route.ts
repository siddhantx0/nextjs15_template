/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { first, last, username, email, password } = body;

		// Validate required fields
		if (!first || !last || !username || !email || !password) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Check if user already exists
		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [{ email: email }, { username: username }],
			},
		});

		if (existingUser) {
			const errorMessage =
				existingUser.email === email
					? "Email already exists"
					: "Username already taken";
			return NextResponse.json({ error: errorMessage }, { status: 400 });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create user
		const user = await prisma.user.create({
			data: {
				name: `${first} ${last}`,
				username,
				email,
				password: hashedPassword,
			},
		});

		// Remove password from response without creating unused variable
		const { password: _password, ...userWithoutPassword } = user;

		return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
	} catch (error) {
		console.error("Signup error:", error);
		return NextResponse.json({ error: "Error creating user" }, { status: 500 });
	}
}
