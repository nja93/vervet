"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Permission = "granted" | "default" | "denied" | undefined;

const WebNotifications = () => {
  const [notificationPermission, setNotificationPermission] =
    useState<Permission>();
  const [serviceWorker, setServiceWorker] =
    useState<ServiceWorkerRegistration>();
  const [subscription, setSubscription] = useState<PushSubscriptionJSON>();
  const [disabled, setDisabled] = useState(false);
  const session = useSession();

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

  const registerServiceWorker = async () => {
    const swRegistration = await navigator.serviceWorker.register(
      "vervet-sw.js"
    );
    setServiceWorker(swRegistration);
    return swRegistration;
  };

  const requestNotificationPermission = async () => {
    if (notificationPermission !== "granted") {
      const permission = await window.Notification.requestPermission();
      setNotificationPermission(permission);
    }
    return window.Notification.permission;
  };

  const main = async () => {
    check();
    const serviceWorker = await registerServiceWorker();
    const permission = await requestNotificationPermission();
    if (permission === "granted") {
      const subscription = await serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY!,
      });
      setSubscription(subscription ?? undefined);
    }
  };

  useEffect(() => {
    if (window !== undefined) {
      setNotificationPermission(window.Notification.permission);
      check();
      registerServiceWorker()
        .then((sw) => {
          return sw.pushManager.getSubscription();
        })
        .then((sub) => {
          setSubscription(sub?.toJSON() ?? undefined);
        });
    }
  }, []);

  const sendSubscription = async () => {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set("Content-Type", "application/json");

    await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/users/id/subscriptions`, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(subscription),
    });
  };

  if (disabled) {
    return (
      <div className="alert">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>

        <span>Your browser does not support sending notifications</span>
      </div>
    );
  }

  return (
    <div className="alert">
      {notificationPermission === "default" && (
        <>
          <span>Allow us to send you notifications?</span>
          <div>
            <button
              className="btn btn-sm"
              onClick={() => setNotificationPermission(undefined)}
            >
              Later
            </button>
            <button
              className="btn btn-sm btn-primary"
              onClick={async () => await main()}
            >
              Accept
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WebNotifications;
