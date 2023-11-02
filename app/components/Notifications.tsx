"use client";
import { HTMLModalElement } from "@/types";
import { BellIcon, BellSlashIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

interface Props {
  disabled: boolean;
}

type Permission = "granted" | "default" | "denied" | undefined;

const Notifications = () => {
  const [notificationPermission, setNotificationPermission] =
    useState<Permission>();
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (window !== undefined) {
      setNotificationPermission(window.Notification.permission);
      check();
      registerServiceWorker();
    }
  }, []);

  const check = () => {
    if (!("serviceWorker" in navigator)) {
      setDisabled(true);
      console.error("No Service Worker support!");
      // throw new Error("No Service Worker support!");
    }
    if (!("PushManager" in window)) {
      setDisabled(true);
      console.error("No Push API support!");
      // throw new Error("No Push API Support!");
    }
  };

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      return;
    }
    return navigator.serviceWorker
      .register("/vervet-sw.js")
      .then(function (registration) {
        console.log("Service worker successfully registered.");
        // setServiceWorker(registration);
        return registration;
      })
      .catch(function (err) {
        console.error("Unable to register service worker.", err);
      });
  }

  function askPermission() {
    if (!("PushManager" in window)) {
      return;
    }
    return new Promise(function (resolve, reject) {
      const permissionResult = window.Notification.requestPermission(function (
        result
      ) {
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    }).then(function (permissionResult) {
      setNotificationPermission(permissionResult as Permission);
      if (permissionResult === "granted") {
        subscribeUserToPush();
      }
    });
  }

  function subscribeUserToPush() {
    return navigator.serviceWorker
      .register("/vervet-sw.js")
      .then(function (registration) {
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY!,
        };

        return registration.pushManager.subscribe(subscribeOptions);
      })
      .then(function (pushSubscription) {
        sendSubscriptionToBackEnd(pushSubscription);
        return pushSubscription;
      });
  }

  function sendSubscriptionToBackEnd(subscription: PushSubscription) {
    return fetch(`/${process.env.NEXT_PUBLIC_API_PATH}/user/subscriptions`, {
      method: "POST",
      body: JSON.stringify(subscription),
    }).then((res) => {
      if (res.status !== 201) {
        setNotificationPermission("default");
        console.log("failed, reverting to default");
      }
    });
  }

  if (disabled) {
    return (
      <button type="button" className="-m-2.5 p-2.5 ">
        <span className="sr-only">
          Browser does not allow sending notifications
        </span>
        <BellSlashIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
      </button>
    );
  }

  if (notificationPermission === "denied") {
    return (
      <button type="button" className="-m-2.5 p-2.5 ">
        <span className="sr-only text-red-500 animate-[pulse_5s_ease-in-out_infinite] hover:animate-none">
          Browser blocked notification permission
        </span>
        <BellSlashIcon
          className="h-6 w-6 text-red-500 animate-[pulse_5s_ease-in-out_infinite] hover:animate-none"
          aria-hidden="true"
        />
      </button>
    );
  }

  if (notificationPermission === "default" || !notificationPermission) {
    return (
      <>
        <button
          type="button"
          className="-m-2.5 p-2.5 "
          onClick={() =>
            (
              document?.getElementById?.(
                "notification_modal"
              ) as HTMLModalElement
            ).showModal()
          }
        >
          <span className="sr-only">Allow us to send you notifications?</span>
          <BellSlashIcon
            className="h-6 w-6 text-yellow-500 animate-[pulse_5s_ease-in-out_infinite] hover:animate-none"
            aria-hidden="true"
          />
        </button>

        <dialog
          id="notification_modal"
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box">
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">Allow us to send you notifications?</p>

            <div className="modal-action ">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
                <div className="flex gap-2">
                  <button className="btn btn-sm">Later</button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => askPermission()}
                  >
                    Accept
                  </button>
                </div>
              </form>
            </div>
          </div>
        </dialog>
      </>
    );
  }

  return (
    <button type="button" className="-m-2.5 p-2.5">
      <span className="sr-only">View notifications</span>
      <BellIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
    </button>
  );
};

export default Notifications;
