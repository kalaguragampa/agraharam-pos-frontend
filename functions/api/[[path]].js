const BACKEND_URL = "https://agraharam-pos-backend-770c.onrender.com";

export async function onRequest(context) {
  const incoming = new URL(context.request.url);

  const target = new URL(
    incoming.pathname.replace(/^\/api(?=\/|$)/, "") + incoming.search,
    BACKEND_URL
  );

  const headers = new Headers(context.request.headers);
  headers.delete("host");

  const request = new Request(target, {
    method: context.request.method,
    headers,
    body: ["GET", "HEAD"].includes(context.request.method)
      ? undefined
      : context.request.body,
    redirect: "manual"
  });

  return fetch(request);
}
