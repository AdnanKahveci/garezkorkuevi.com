interface Env {
  ASSETS: Fetcher;
}

/** www → apex 301; diğer istekler static dosyalara gider. */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === 'www.garezkorkuevi.com') {
      url.hostname = 'garezkorkuevi.com';
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
