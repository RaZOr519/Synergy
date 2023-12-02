"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

const Nav = () => {
	const { data: session } = useSession();
	const [providers, setProviders] = useState();
	const [toggleDropdown, setToggleDropdown] = useState(false);

	useEffect(() => {
		const setUpProviders = async () => {
			const response = await getProviders();
			setProviders(response);
		};

		setUpProviders();
	}, []);

	return (
		<nav className="flex-between w-full mb-15 pt-3">
			<Link href="/" className="flex gap-2 flex-center">
				<Image
					src="/assets/images/logo.png"
					alt="logo image"
					width={30}
					height={30}
					className="object-contain bg-orange-500 rounded-full"
				/>
				<p className="logo_text"> Synergy </p>
			</Link>

			{/* Desktop Nav */}
			<div className="hidden md:flex flex-grow items-center justify-center">
				{session?.user ? (
					<div className="flex flex-column md:gap-5">
						<Link
							href="/Goals"
							className="flex items-center text_hover"
						>
							My Goals
						</Link>

						<Link
							href="/Tasks"
							className="flex items-center text_hover"
						>
							My Tasks
						</Link>

						<Link
							href="/Groups"
							className="flex items-center text_hover"
						>
							Groups
						</Link>
					</div>
				) : null}
			</div>

			{session?.user ? (
				<div className="hidden md:flex  gap3 md:gap-5 items-center">
					<button
						type="button"
						onClick={signOut}
						className="outline_btn mx-4 lg:mx-0"
					>
						Sign Out
					</button>

					<Link href="/profile">
						<Image
							className="rounded-full"
							src={session.user.image}
							alt="Profile"
							width={33}
							height={33}
						/>
					</Link>
				</div>
			) : (
				<></>
			)}

			{/* Mobile Navigation */}
			<div className="md:hidden flex relative">
				{session?.user ? (
					<div
						className="flex justify-between"
						onClick={() => setToggleDropdown((prev) => !prev)}
					>
						<>
							<div className="flex flex-column gap-5 font-bold">
								<Link
									href="/components/Feed.jsx"
									className="flex items-center text_hover"
								>
									Goals
								</Link>

								<Link
									href="#"
									className="flex items-center text_hover"
								>
									Tasks
								</Link>

								<Link
									href="#"
									className="flex items-center text_hover"
								>
									Groups
								</Link>
							</div>

							<div>
								<Image
									className="ml-5 rounded-full"
									src={session.user.image}
									alt="Profile"
									width={33}
									height={33}
								/>
							</div>
						</>
						{toggleDropdown && (
							<div className="dropdown shadow-xl">
								<button
									type="button"
									onClick={() => {
										setToggleDropdown(false);
										signOut();
									}}
								>
									Sign Out
								</button>
							</div>
						)}
					</div>
				) : (
					<></>
				)}
			</div>
		</nav>
	);
};

export default Nav;
