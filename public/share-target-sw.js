// Web Share Target handler, pulled into the generated service worker through
// workbox.importScripts (vite.config.ts). The manifest's share_target POSTs
// shared files to /share-target; there is no server route for it, so the
// worker stashes the files in a cache and redirects to the app, which imports
// them (src/lib/importFiles.ts takeSharedFiles). Keep names in sync.
const SHARE_CACHE = "draw-share-target";

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "POST" || url.pathname !== "/share-target") return;
  event.respondWith(
    (async () => {
      const form = await event.request.formData();
      const files = form.getAll("files").filter((f) => f instanceof File);
      await caches.delete(SHARE_CACHE);
      const cache = await caches.open(SHARE_CACHE);
      await Promise.all(
        files.map((file, i) =>
          cache.put(
            `/share-target/${i}`,
            new Response(file, {
              headers: {
                "content-type": file.type || "application/octet-stream",
                "x-file-name": encodeURIComponent(file.name),
              },
            }),
          ),
        ),
      );
      return Response.redirect("/?share-target=1", 303);
    })(),
  );
});
