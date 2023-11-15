"use client";

import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  ArrowRightIcon,
  Bars3Icon,
  ChatBubbleLeftEllipsisIcon,
  ChevronDownIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  MegaphoneIcon,
  MoonIcon,
  NewspaperIcon,
  SunIcon,
  UserCircleIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Fragment, ReactNode, useEffect, useState } from "react";

import Notifications from "@/app/(app)/components/Notifications";
import { classNames } from "@/lib/utils/app";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ProgressLoader } from "nextjs-progressloader";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { themeChange } from "theme-change";
import { Toaster } from "react-hot-toast";

export default function NavBar({ children }: { children: ReactNode }) {
  const session = useSession();
  const path = usePathname();
  const { push } = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<string>();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    reValidateMode: "onSubmit",
  });

  const onSearch: SubmitHandler<FieldValues> = (data: FieldValues) => {
    push(`/search?query=${data.search}`);
  };

  const navigation = [
    { name: "Home", href: "/home", icon: HomeIcon, current: path === "/home" },
    {
      name: "Feeds",
      href: "/feeds",
      icon: MegaphoneIcon,
      current: path.startsWith("/feeds"),
    },
    {
      name: "Subscriptions",
      href: "/subscriptions",
      icon: NewspaperIcon,
      current: path.startsWith("/subscriptions"),
    },
    {
      name: "Channels",
      href: "/channels",
      icon: UserCircleIcon,
      current: path.startsWith("/channels"),
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: ChatBubbleLeftEllipsisIcon,
      current: path.startsWith("/notifications"),
    },
  ];

  const userNavigation = [{ name: "Profile", href: "/profile" }];

  useEffect(() => {
    themeChange(false); // 👆 false parameter is required for react project
    let localTheme = localStorage.getItem("theme") ?? "light";

    setTheme(localTheme);
  }, []);

  useEffect(() => {
    if (theme) {
      localStorage.setItem("theme", theme);
      document.querySelector("html")?.setAttribute("data-theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div>
      {session.status == "authenticated" && (
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>

                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-base-100 px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                      {theme === "light" ? (
                        <img
                          className="h-8 w-auto"
                          src="/img/vervet.png"
                          alt="vervet"
                        />
                      ) : (
                        <img
                          className="h-8 w-auto"
                          src="/img/vervet_white.png"
                          alt="vervet"
                        />
                      )}
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={classNames(
                                    item.current
                                      ? "bg-gray-200 text-indigo-600"
                                      : " hover:text-indigo-600 hover:bg-gray-50",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <item.icon
                                    className={classNames(
                                      item.current
                                        ? "text-indigo-600"
                                        : " group-hover:text-indigo-600",
                                      "h-6 w-6 shrink-0"
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>

                        {session.status == "authenticated" && (
                          <ul className="mt-auto">
                            <li className="mt-auto">
                              <Link
                                href="/profile"
                                className={classNames(
                                  path.startsWith("/profile")
                                    ? "bg-gray-200 text-indigo-600"
                                    : " hover:text-indigo-600 hover:bg-gray-50",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                )}
                              >
                                <UserIcon
                                  className="h-6 w-6 shrink-0  group-hover:text-indigo-600"
                                  aria-hidden="true"
                                />
                                Profile
                              </Link>
                            </li>
                          </ul>
                        )}
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      )}

      {/* Static sidebar for desktop */}
      {session.status == "authenticated" && (
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white dark:bg-base-100 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              {theme === "light" ? (
                <img
                  className="h-8 w-auto"
                  src="/img/vervet.png"
                  alt="vervet"
                />
              ) : (
                <img
                  className="h-8 w-auto"
                  src="/img/vervet_white.png"
                  alt="vervet"
                />
              )}
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-200 text-indigo-600"
                              : " hover:text-indigo-600 hover:bg-gray-50",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current
                                ? "text-indigo-600"
                                : " group-hover:text-indigo-600",
                              "h-6 w-6 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>

                {session.status == "authenticated" && (
                  <ul className="mt-auto">
                    <li className="mt-auto">
                      <Link
                        href="/profile"
                        className={classNames(
                          path.startsWith("/profile")
                            ? "bg-gray-200 text-indigo-600"
                            : " hover:text-indigo-600 hover:bg-gray-50",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                        )}
                      >
                        <UserIcon
                          className="h-6 w-6 shrink-0  group-hover:text-indigo-600"
                          aria-hidden="true"
                        />
                        Profile
                      </Link>
                    </li>
                  </ul>
                )}
              </ul>
            </nav>
          </div>
        </div>
      )}

      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-full lg:px-8">
          <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white dark:bg-base-100 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
            <button
              type="button"
              className="-m-2.5 p-2.5  lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            <div
              className="h-6 w-px bg-gray-200 lg:hidden"
              aria-hidden="true"
            />

            <div className="flex justify-end flex-1 gap-x-4 self-stretch lg:gap-x-6">
              {session.status == "authenticated" && (
                <form
                  className="relative flex flex-1 "
                  onSubmit={handleSubmit(onSearch)}
                >
                  <label htmlFor="search-field" className="sr-only ">
                    Search
                  </label>
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 "
                    aria-hidden="true"
                  />

                  <input
                    id="search-field"
                    className="block h-full w-full border-0 py-0 pl-8 pr-0  placeholder: focus:ring-0 sm:text-sm dark:bg-base-100 border-1 "
                    placeholder="Search..."
                    {...register("search")}
                    type="search"
                  />
                </form>
              )}

              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {session.status === "authenticated" && <Notifications />}

                <label className="swap swap-rotate ">
                  <input
                    type="checkbox"
                    data-toggle-theme="light,dark"
                    data-act-class="swap-active"
                    className="hidden"
                    defaultChecked={theme === "dark"}
                    onClick={toggleTheme}
                  />

                  <SunIcon className={"swap-off fill-current w-6 h-6 hover:"} />

                  <MoonIcon className={"swap-on fill-current w-6 h-6 hover:"} />
                </label>

                <div
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                  aria-hidden="true"
                />

                {session.status === "authenticated" && (
                  <Menu as="div" className="relative">
                    <Menu.Button className="-m-1.5 flex items-center p-1.5">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full bg-gray-50"
                        src={session?.data?.user?.image ?? undefined}
                        alt=""
                      />
                      <span className="hidden lg:flex lg:items-center">
                        <span
                          className="ml-4 text-sm font-semibold leading-6 "
                          aria-hidden="true"
                        >
                          {session?.data?.user?.name ?? ""}
                        </span>
                        <ChevronDownIcon
                          className="ml-2 h-5 w-5 "
                          aria-hidden="true"
                        />
                      </span>
                    </Menu.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white dark:bg-base-100 py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                href={item.href}
                                className={classNames(
                                  active ? "bg-gray-200  dark:bg-gray-800" : "",
                                  "block px-3 py-1 text-sm leading-6 "
                                )}
                              >
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}

                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                signOut({
                                  callbackUrl: "https://localhost:3000/home",
                                })
                              }
                              className={classNames(
                                active ? "bg-gray-200  dark:bg-gray-800" : "",
                                "block px-3 py-1 text-sm leading-6 w-full text-left "
                              )}
                            >
                              Sign Out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
                {session.status === "unauthenticated" && (
                  <Link href="/signin">
                    {" "}
                    <span className="flex lg:flex lg:items-center font-semibold leading-6  ">
                      <span className="ml-4 text-sm " aria-hidden="true">
                        Log In
                      </span>
                      <ArrowRightIcon
                        className="ml-2 h-5 w-5 "
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                )}
                {session.status === "loading" && (
                  <span className="loading loading-ring loading-sm"></span>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="py-10 dark:text-gray-200 dark:bg-base-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ProgressLoader />
            <Toaster
              position="top-right"
              reverseOrder={false}
              containerClassName=""
              containerStyle={{}}
              toastOptions={{
                // Define default options
                className: "dark:bg-base-100 dark:text-gray-50",
                duration: 5000,
              }}
            />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
