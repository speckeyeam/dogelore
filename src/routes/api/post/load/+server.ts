import { json } from "@sveltejs/kit";

import { PrismaClient } from "@prisma/client";
import type { RequestEvent, RequestHandler } from "./$types";
import { postExists, getPosts2 } from "$lib/server/server";

const prisma = new PrismaClient();

export const POST: RequestHandler = async (event: RequestEvent) => {
  const session = await event.locals.getSession();

  console.log(session);

  const data = await event.request.json();

  let id = data.id;
  if (id) {
    const posts = await getPosts2(id);

    return json({ posts });
  }

  //   if (!session?.user) throw redirect(303, "/auth");

  //should prob check other stuff just in case
  return json({ sucess: false });
  //return json(newList.value + " test");
};
