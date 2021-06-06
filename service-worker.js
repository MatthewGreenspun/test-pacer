importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js"
);

workbox.routing.registerRoute(
  ({ request }) => request.destination === "image",
  new workbox.strategies.CacheFirst()
);
// workbox.precaching.precacheAndRoute([
//   { url: "/index.html", revision: null },
//   { url: "/index.css", revision: null },
//   { url: "/index.js", revision: null },
// ]);
