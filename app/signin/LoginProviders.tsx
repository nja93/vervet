"use client";
import { BuiltInProviderType } from "next-auth/providers/index";
import { ClientSafeProvider, LiteralUnion, signIn } from "next-auth/react";
import React from "react";

interface Props {
  providers: Record<
    LiteralUnion<BuiltInProviderType>,
    ClientSafeProvider
  > | null;
}

const LoginProviders = ({ providers }: Props) => {
  return (
    <>
      {" "}
      {Object.values(providers!).map((provider) => (
        <div key={provider.name}>
          <button
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() =>
              signIn(provider.id, {
                callbackUrl: "https://localhost:3000/home",
              })
            }
          >
            <div className="flex gap-1 items-center">
              <img
                src={`/${provider.name.toLowerCase()}.svg`}
                alt={`${provider.name}`}
              />{" "}
              <div className="h-6 w-px bg-gray-200" aria-hidden="true" /> Sign
              in with {provider.name}
            </div>
          </button>
        </div>
      ))}
    </>
  );
};

export default LoginProviders;
