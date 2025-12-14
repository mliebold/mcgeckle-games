import {
  D1Database,
  type ExportedHandler,
  Request,
  Response,
} from "@cloudflare/workers-types";

export interface Env {
  mcgeckle_games: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // const { pathname } = new URL(request.url);

    // if (pathname === "api/games") {
    //   const { results: games } = await env.mcgeckle_games
    //     .prepare("SELECT * FROM Games")
    //     .run();
    //   return Response.json(games);
    // }

    return new Response("Call /api/games to see any games.");
  },
} satisfies ExportedHandler<Env>;
