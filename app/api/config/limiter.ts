import { RateLimiter } from "limiter";

// Allow 150 requests per hour (the Twitter search limit). Also understands
// 'second', 'minute', 'day', or a number of milliseconds

const limiters: {
  [key: string]: RateLimiter;
} = {};

export async function canSendRequest(path: string) {
  if (!(path in limiters)) {
    limiters[path] = new RateLimiter({
      tokensPerInterval: 5,
      interval: "minute",
      fireImmediately: true,
    });
  }

  return (await limiters[path].removeTokens(1)) >= 0;
}
