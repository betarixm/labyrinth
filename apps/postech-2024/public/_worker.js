export default {
  /**
   * @typedef Environment
   * @prop {import("@cloudflare/workers-types").D1Database} DATABASE
   * @prop {import("@cloudflare/workers-types").Fetcher} ASSETS
   *
   * @param {import("@cloudflare/workers-types").Request} request
   * @param {Environment} environment
   * @returns {Promise<import("@cloudflare/workers-types").Response>}
   */
  async fetch(request, environment) {
    const url = new URL(request.url);

    if (url.pathname === "/api/log") {
      const params = url.searchParams;
      const username = params.get("username");
      const hash = params.get("hash");

      if (!username || !hash) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "username and hash are required",
          }),
          {
            status: 400,
          },
        );
      }

      if (!/^[a-f0-9]{64}$/.test(hash)) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "hash must be a 64-character hexadecimal string",
          }),
          {
            status: 400,
          },
        );
      }

      const statement = environment.DATABASE.prepare(
        "INSERT INTO logs (username, path) VALUES (?, ?)",
      ).bind(username, hash);

      try {
        const { success, results } = await statement.run();

        return new Response(JSON.stringify({ results, success }), {
          status: success ? 201 : 418,
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ success: false, message: error }),
          {
            status: 400,
          },
        );
      }
    } else if (url.pathname === "/api/count") {
      const params = url.searchParams;
      const username = params.get("username");

      if (!username) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "username is required",
          }),
          {
            status: 400,
          },
        );
      }

      const statement = environment.DATABASE.prepare(
        "SELECT COUNT(DISTINCT path) as count FROM logs WHERE username=?",
      ).bind(username);

      const { count } = await statement.first();

      return new Response(JSON.stringify({ count }), { status: 200 });
    } else if (url.pathname == "/api/views") {
      const params = url.searchParams;
      const path = params.get("path");

      if (!path) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "path is required",
          }),
          {
            status: 400,
          },
        );
      }

      const statement = environment.DATABASE.prepare(
        "SELECT COUNT(DISTINCT username) as views FROM logs WHERE path=?",
      ).bind(path);

      const { views } = await statement.first();

      return new Response(JSON.stringify({ views }), { status: 200 });
    }

    return environment.ASSETS.fetch(request);
  },
};
