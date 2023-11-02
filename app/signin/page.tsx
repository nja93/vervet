import LoginProviders from "@/app/signin/LoginProviders";
import { getProviders } from "next-auth/react";
import React from "react";

const Login = async () => {
  const providers = await getProviders();
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Vervet"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight ">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white dark:shadow-gray-50 dark:bg-base-100 px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <div>
              <div className="relative mt-10">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white dark:bg-base-100 px-6 ">
                    Continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <LoginProviders providers={providers} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
