import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { PrismaClient } from "@prisma/client";
import type { RequestEvent } from "./$types";

const prisma = new PrismaClient();

export const POST = (async (event: RequestEvent) => {
  const session = await event.locals.getSession();

  if (session?.user) {
    const data = await event.request.formData();
    console.log([...data]);
    const files = data.get("files");
    const title = data.get("title");
    if (files && title) {
      //do s3 stuff
      console.log("sucess");
    }
  } else {
  }

  //   if (!session?.user) throw redirect(303, "/auth");

  //should prob check other stuff just in case
  return json({ sucess: true });
  //return json(newList.value + " test");
}) satisfies RequestHandler;
