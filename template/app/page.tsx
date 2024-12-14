"use client";
import SignUp from "./signup/page";
import { RecoilRoot } from "recoil";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
	const { data: session } = useSession();

	if (session) {
		return (
			<>
				Signed in as {session.user?.email} <br />
				<button onClick={() => signOut()}>Sign out</button>
			</>
		);
	}
	return (
		<>
			<RecoilRoot>
				<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
					<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
						Not signed in <br />
						<button onClick={() => signIn()}>Sign in</button>
						<SignUp />
					</main>
					<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
						footer
					</footer>
				</div>
			</RecoilRoot>
		</>
	);
}
