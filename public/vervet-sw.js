self.addEventListener("install", () => {
  console.log("service worker installed!!!!");
});

self.addEventListener("activate", () => {
  console.log("service worker activated!!!");
});

self.addEventListener("push", (event) => {
  console.log("Received push event");
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "vervet.svg",
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
