export default {
  async fetch(request, env) {
    if (!env.ASSETS || typeof env.ASSETS.fetch !== "function") {
      return new Response("Kelo Care assets are not available.", { status: 503 });
    }

    return env.ASSETS.fetch(request);
  },
};
