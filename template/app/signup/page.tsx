"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SignUp = () => {
	const router = useRouter();

	console.log("Signup Rendered");
	useEffect(() => {
		console.log("page load");
	}, []);

	const [fields, setFields] = useState({
		first: "",
		last: "",
		username: "",
		email: "",
		password: "",
		confirmpassword: "",
	});

	const [fieldErrors, setFieldErrors] = useState({
		first: "",
		last: "",
		username: "",
		email: "",
		password: "",
		confirmpassword: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Reset all field errors
		setFieldErrors({
			first: "",
			last: "",
			username: "",
			email: "",
			password: "",
			confirmpassword: "",
		});

		// Track if there are any errors
		let hasErrors = false;

		// Check each field
		if (!fields.first) {
			setFieldErrors((prev) => ({
				...prev,
				first: "Please fill in your first name",
			}));
			hasErrors = true;
		}
		if (!fields.last) {
			setFieldErrors((prev) => ({
				...prev,
				last: "Please fill in your last name",
			}));
			hasErrors = true;
		}
		if (!fields.username) {
			setFieldErrors((prev) => ({
				...prev,
				username: "Please fill in your username",
			}));
			hasErrors = true;
		}
		if (!fields.email) {
			setFieldErrors((prev) => ({
				...prev,
				email: "Please fill in your email",
			}));
			hasErrors = true;
		}
		if (!fields.password) {
			setFieldErrors((prev) => ({
				...prev,
				password: "Please fill in your password",
			}));
			hasErrors = true;
		}
		if (!fields.confirmpassword) {
			setFieldErrors((prev) => ({
				...prev,
				confirmpassword: "Please confirm your password",
			}));
			hasErrors = true;
		}
		if (
			fields.password &&
			fields.confirmpassword &&
			fields.password !== fields.confirmpassword
		) {
			setFieldErrors((prev) => ({
				...prev,
				confirmpassword: "Passwords do not match",
			}));
			hasErrors = true;
		}

		if (hasErrors) {
			return;
		}

		try {
			// Check if username or email exists
			const checkResponse = await fetch("/api/check-user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(fields),
			});

			const checkData = await checkResponse.json();

			if (!checkResponse.ok) {
				setFieldErrors((prev) => ({ ...prev, username: checkData.error }));
				return;
			}

			if (checkData.exists) {
				if (checkData.message.includes("Username")) {
					setFieldErrors((prev) => ({ ...prev, username: checkData.message }));
				} else {
					setFieldErrors((prev) => ({ ...prev, email: checkData.message }));
				}
				return;
			}

			// If checks pass, create the user
			const createResponse = await fetch("/api/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(fields),
			});

			const createData = await createResponse.json();

			if (createResponse.ok) {
				router.push("/login");
			} else {
				setFieldErrors((prev) => ({ ...prev, username: createData.error }));
				return;
			}
			// Success! Redirect or show success message
			// window.location.href = "/login"; // or use Next.js router
		} catch (error) {
			setFieldErrors((prev) => ({
				...prev,
				confirmpassword: "Something went wrong. Please try again.",
			}));
			console.error(error);
		}
	};

	return (
		<form
			className="shadow-xl shadow-gray-700 flex flex-col rounded-lg bg-white text-black p-3 w-96 gap-2 px-8 mx-auto mt-20"
			onSubmit={handleSubmit}
		>
			<div className="pt-5 text-4xl mb-4">Sign Up</div>
			<div className="flex flex-col justify-center rounded-lg gap-2">
				<div className="flex gap-3">
					<div className="w-1/2 flex flex-col">
						<div className="pb-2">First Name</div>

						<input
							id="first-name"
							type="text"
							placeholder="Siddhant"
							value={fields.first}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setFields((prev) => ({ ...prev, first: e.target.value }))
							}
							className="w-full p-2 border-2 border-grey-300 rounded-lg overflow-hidden"
						/>
						{fieldErrors.first && (
							<span className="text-red-500 text-sm mt-1">
								{fieldErrors.first}
							</span>
						)}
					</div>
					<div className="w-1/2 flex flex-col">
						<div className="pb-2">Last Name</div>

						<input
							id="last-name"
							type="text"
							placeholder="Singh"
							value={fields.last}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setFields((prev) => ({ ...prev, last: e.target.value }))
							}
							className="w-full p-2 border-2 border-grey-300 rounded-lg overflow-hidden"
						/>
						{fieldErrors.last && (
							<span className="text-red-500 text-sm mt-1">
								{fieldErrors.last}
							</span>
						)}
					</div>
				</div>

				<div>Username</div>
				<div className="flex flex-col">
					<input
						id="username"
						type="text"
						placeholder="Username"
						value={fields.username}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setFields((prev) => ({ ...prev, username: e.target.value }))
						}
						className="p-2 flex border-2 border-grey-300 rounded-lg overflow-hidden"
					/>
					{fieldErrors.username && (
						<span className="text-red-500 text-sm mt-1">
							{fieldErrors.username}
						</span>
					)}
				</div>

				<div>Email</div>
				<div className="flex flex-col">
					<input
						id="email"
						type="email"
						placeholder="johndoe@template.com"
						value={fields.email}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setFields((prev) => ({ ...prev, email: e.target.value }))
						}
						className="p-2 flex border-2 border-grey-300 rounded-lg overflow-hidden"
					/>
					{fieldErrors.email && (
						<span className="text-red-500 text-sm mt-1">
							{fieldErrors.email}
						</span>
					)}
				</div>

				<div>Password</div>
				<div className="flex flex-col">
					<input
						id="password"
						type="password"
						placeholder="password"
						value={fields.password}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setFields((prev) => ({ ...prev, password: e.target.value }))
						}
						className="p-2 flex border-2 border-grey-300 rounded-lg overflow-hidden"
					/>
					{fieldErrors.password && (
						<span className="text-red-500 text-sm mt-1">
							{fieldErrors.password}
						</span>
					)}
				</div>

				<div>Confirm password</div>
				<div className="flex flex-col">
					<input
						id="confirm-password"
						type="password"
						placeholder="password"
						value={fields.confirmpassword}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setFields((prev) => ({
								...prev,
								confirmpassword: e.target.value,
							}))
						}
						className={`p-2 flex border-2 border-grey-300 rounded-lg overflow-hidden ${
							fields["password"].length == 0
								? "bg-gray-100 pointer-events-none ease-in-out duration-200"
								: "ease-in-out duration-500"
						}`}
					/>
					{fieldErrors.confirmpassword && (
						<span className="text-red-500 text-sm mt-1">
							{fieldErrors.confirmpassword}
						</span>
					)}
					<span
						className={`text-red-500 text-sm mt-1 transition-opacity duration-200 ${
							fields.password !== fields.confirmpassword &&
							fields.confirmpassword.length !== 0
								? "opacity-100"
								: "opacity-0"
						}`}
					>
						Passwords do not match
					</span>{" "}
				</div>
			</div>

			<button
				className="bg-black text-white p-3 mb-5 mt-4 rounded-md"
				type="submit"
			>
				Submit
			</button>

			<div className="text-center text-gray-600 text-sm mb-4">
				Already have an account?{" "}
				<button
					type="button"
					onClick={() => router.push("/login")}
					className="text-blue-500 hover:underline"
				>
					Login
				</button>
			</div>
		</form>
	);
};

export default SignUp;
