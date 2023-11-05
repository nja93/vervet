var notificationId;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.skipWaiting();
});

self.addEventListener("push", (event) => {
  const data = event.data.json();

  notificationId = data.id;

  const options = {
    id: data.id,
    body: data.body,
    icon: "vervet.svg",
    tag: `${data.title};${data.id}`,
    actions: data.actions,
    renotify: data.renotify,
    requireInteraction: data.requireInteraction,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener(
  "notificationclick",
  (event) => {
    const url = "/notifications";

    function goToNotifications() {
      event.waitUntil(
        clients
          .matchAll({ type: "window", includeUncontrolled: true })
          .then((windowClients) => {
            let found = false;
            windowClients.every((client) => {
              if (client.url.includes(url)) {
                found = true;
                client.navigate(url);
                client.focus();
                return false;
              }
              return true;
            });
            // If not, then open the target URL in a new window/tab.
            if (!found && clients.openWindow) {
              return clients.openWindow(url).then(function (client) {
                client.navigate(url);
              });
            }
          })
      );
    }
    if (!event.action) {
      // Was a normal notification click
      goToNotifications();
    }

    const clickedNotification = event.notification;

    switch (event.action) {
      case "positive-action":
        fetch(`/api/replies/${notificationId}`, {
          method: "PUT",
          body: JSON.stringify({
            action: "positive-action",
          }),
        });
        break;
      case "negative-action":
        fetch(`/api/replies/${notificationId}`, {
          method: "PUT",
          body: JSON.stringify({
            action: "negative-action",
          }),
        });
        break;
      default:
        fetch(`/api/replies/${notificationId}`, {
          method: "PUT",
          body: JSON.stringify({
            action: "",
          }),
        });
        break;
    }

    clickedNotification.close();
  },
  false
);
