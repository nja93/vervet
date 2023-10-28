import * as webPush from "web-push";

webPush.setVapidDetails(
  process.env.NEXT_PUBLIC_VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_KEY!,
  process.env.PRIVATE_VAPID_KEY!
);

export default webPush;
