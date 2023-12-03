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
            <Link href="/Goals" className="flex items-center text_hover">
              My Goals{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="16"
                viewBox="0 0 512 512"
                className="ml-2"
              >
                <path d="M448 256A192 192 0 1 0 64 256a192 192 0 1 0 384 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 80a80 80 0 1 0 0-160 80 80 0 1 0 0 160zm0-224a144 144 0 1 1 0 288 144 144 0 1 1 0-288zM224 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
              </svg>
            </Link>

            <Link href="/Tasks" className="flex items-center text_hover px-3">
              My Tasks{"   "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="16"
                viewBox="0 0 512 512"
                className="ml-2"
              >
                <path d="M448 160H320V128H448v32zM48 64C21.5 64 0 85.5 0 112v64c0 26.5 21.5 48 48 48H464c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zM448 352v32H192V352H448zM48 288c-26.5 0-48 21.5-48 48v64c0 26.5 21.5 48 48 48H464c26.5 0 48-21.5 48-48V336c0-26.5-21.5-48-48-48H48z" />
              </svg>
            </Link>

            <Link href="/Groups" className="flex items-center text_hover">
              Groups{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="20"
                viewBox="0 0 640 512"
                className="ml-2"
              >
                <path d="M72 88a56 56 0 1 1 112 0A56 56 0 1 1 72 88zM64 245.7C54 256.9 48 271.8 48 288s6 31.1 16 42.3V245.7zm144.4-49.3C178.7 222.7 160 261.2 160 304c0 34.3 12 65.8 32 90.5V416c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V389.2C26.2 371.2 0 332.7 0 288c0-61.9 50.1-112 112-112h32c24 0 46.2 7.5 64.4 20.3zM448 416V394.5c20-24.7 32-56.2 32-90.5c0-42.8-18.7-81.3-48.4-107.7C449.8 183.5 472 176 496 176h32c61.9 0 112 50.1 112 112c0 44.7-26.2 83.2-64 101.2V416c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32zm8-328a56 56 0 1 1 112 0A56 56 0 1 1 456 88zM576 245.7v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM320 32a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM240 304c0 16.2 6 31 16 42.3V261.7c-10 11.3-16 26.1-16 42.3zm144-42.3v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM448 304c0 44.7-26.2 83.2-64 101.2V448c0 17.7-14.3 32-32 32H288c-17.7 0-32-14.3-32-32V405.2c-37.8-18-64-56.5-64-101.2c0-61.9 50.1-112 112-112h32c61.9 0 112 50.1 112 112z" />
              </svg>
            </Link>
          </div>
        ) : null}
      </div>

      {session?.user ? (
        <div className="hidden md:flex  gap3 md:gap-5 items-center">
          <button type="button" onClick={signOut} className="outline_btn mx-4 lg:mx-0">
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
          <div className="flex justify-between" onClick={() => setToggleDropdown((prev) => !prev)}>
            <>
              <div className="flex flex-column gap-5 font-bold">
                <Link href="/components/Feed.jsx" className="flex items-center text_hover">
                  Goals
                </Link>

                <Link href="#" className="flex items-center text_hover">
                  Tasks
                </Link>

                <Link href="#" className="flex items-center text_hover">
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
