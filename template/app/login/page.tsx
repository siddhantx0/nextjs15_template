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

	const handleGoogleSignIn = () => {
		signIn("google", { callbackUrl: "/" });
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="shadow-xl shadow-gray-700 flex flex-col rounded-lg bg-white text-black p-3 w-96 gap-2 px-8 mx-auto mt-20"
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

			<button
				type="button"
				onClick={handleGoogleSignIn}
				className="flex items-center justify-center gap-2 p-3 border-2 rounded-md hover:bg-gray-50 transition-colors mb-4"
			>
				<svg className="w-5 h-5" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
					/>
					<path
						fill="currentColor"
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
					/>
					<path
						fill="currentColor"
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
					/>
					<path
						fill="currentColor"
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
					/>
				</svg>
				Continue with Google
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
