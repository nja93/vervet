"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface Props {
  userName: string | undefined;
  userImage: string | undefined;
  feedName: string;
  name: string;
  content: string;
}

export default function NotificationView({
  userName,
  userImage,
  feedName,
  name,
  content,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span
        className="link link-hover"
        onClick={() => setOpen((prev) => !prev)}
      >
        View
      </span>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mx-auto flex-col gap-5 h-12 w-12 items-center justify-center">
                      <div className="-m-1.5 flex items-center p-1.5">
                        <img
                          className="h-8 w-8 rounded-full bg-gray-50"
                          src={userImage ?? undefined}
                          alt="user"
                        />
                      </div>
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        {name}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">{content}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="btn btn-ghost flex justify-center"
                      onClick={() => setOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
