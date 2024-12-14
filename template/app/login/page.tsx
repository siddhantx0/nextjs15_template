"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
	const router = useRouter();
	const [fields, setFields] = useState({
		login: "", // Changed from separate email/username
		password: "",
	});

	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const response = await signIn("credentials", {
				login: fields.login, // Using single login field
				password: fields.password,
				redirect: false,
			});

			if (response?.error) {
				setError("Invalid credentials");
				return;
			}

			if (response?.ok) {
				router.push("/"); // Redirect to home page after successful login
				router.refresh();
			}
		} catch (error) {
			console.error(error);
			setError("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col rounded-lg bg-white text-black p-3 w-96 gap-2 px-8 mx-auto mt-20"
		>
			<div className="pt-5 text-4xl mb-4">Login</div>
			<div className="flex flex-col justify-center rounded-lg gap-2">
				<div>Username or Email</div>
				<div className="flex flex-col">
					<input
						id="login"
						type="text"
						placeholder="Enter username or email"
						value={fields.login}
						onChange={(e) =>
							setFields((prev) => ({ ...prev, login: e.target.value }))
						}
						className="p-2 flex border-2 border-grey-300 rounded-lg overflow-hidden"
					/>
				</div>

				<div>Password</div>
				<div className="flex flex-col">
					<input
						id="password"
						type="password"
						placeholder="••••••••"
						value={fields.password}
						onChange={(e) =>
							setFields((prev) => ({ ...prev, password: e.target.value }))
						}
						className="p-2 flex border-2 border-grey-300 rounded-lg overflow-hidden"
					/>
				</div>

				{error && <div className="text-red-500 text-sm mt-1">{error}</div>}
			</div>

			<button
				type="submit"
				disabled={isLoading}
				className={`bg-black text-white p-3 mb-5 mt-4 rounded-md hover:bg-gray-800 ${
					isLoading ? "opacity-50 cursor-not-allowed" : ""
				}`}
			>
				{isLoading ? "Signing in..." : "Sign In"}
			</button>

			<div className="text-center text-gray-600 text-sm mb-4">
				Don&apos;t have an account?{" "}
				<button
					type="button"
					onClick={() => router.push("/signup")}
					className="text-blue-500 hover:underline"
				>
					Sign Up
				</button>
			</div>
		</form>
	);
}
