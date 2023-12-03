"use client";

import { useState, useEffect } from "react";
import { signIn, useSession, getProviders } from "next-auth/react";
import Image from "next/image";
import Tasks from "./Tasks/page";
import { useRouter } from "next/router";

const Home = () => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState();

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    setUpProviders();
  }, []);

  return (
    <section className="w-full flex-center flex-col">
      <div className="flex flex-grow items-center justify-center">
        {session?.user ? (
          <div>
            <Tasks />
          </div>
        ) : (
          <>
            <div className="flex justify-center items-center flex-col h-screen pb-80 md:pb-32">
              <h1 className="orange_gradient text-6xl md:text-9xl font-bold p-8">Get started</h1>
              <div className="flex gap-2 flex-center">
                <p className="logo_text"> With </p>
                <Image
                  src="/assets/images/logo.png"
                  alt="logo image"
                  width={30}
                  height={30}
                  className="object-contain bg-orange-500 rounded-full"
                />
                <p className="logo_text"> Synergy </p>
              </div>

              <div className="flex p-10">
                <button type="button" onClick={() => signIn("google")} className="black_btn">
                  Sign In
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
