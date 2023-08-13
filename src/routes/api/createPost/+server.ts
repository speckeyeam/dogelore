import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { PrismaClient } from "@prisma/client";
import type { RequestEvent } from "./$types";

const prisma = new PrismaClient();

export const POST = (async (event: RequestEvent) => {
  const session = await event.locals.getSession();

  if (session?.user) {
    const data = await event.request.formData();
    //console.log([...data]);
    const files = data.getAll("file");
    const title = data.get("title");
    const array = [...files];
    console.log(files.length);
    if (files && title) {
      //do s3 stuff
      //console.log(files.length);
    }
  } else {
  }

  //   if (!session?.user) throw redirect(303, "/auth");

  //should prob check other stuff just in case
  return json({ sucess: true });
  //return json(newList.value + " test");
}) satisfies RequestHandler;
