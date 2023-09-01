import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { PrismaClient } from "@prisma/client";
import type { RequestEvent } from "./$types";
import { postExists } from "$lib/server/server";

const prisma = new PrismaClient();

export const POST = (async (event: RequestEvent) => {
  const session = await event.locals.getSession();

  if (session?.user) {
    const data = await event.request.json();
    let comment = data.comment;
    let post_id = data.post_id;
    let reply = data.reply;
    let reply_to = data.reply_to;
    if (comment && postExists(post_id)) {
      if (comment.length > 0 && comment.length < 5000) {
        if (!reply) {
          const post = await prisma.comment.create({
            data: {
              post_id,
              userId: session.user.id,
              reply: false,
              text: comment,
              date: new Date(),
            },
            include: { User: true },
          });
          if (post) {
            return json({ sucess: true, comment: post });
          }
        } else {
          if (reply_to) {
            const post = await prisma.comment.create({
              data: {
                post_id,
                userId: session.user.id,
                reply: true,
                reply_to,
                text: comment,
                date: new Date(),
              },
              include: { User: true },
            });
            if (post) {
              return json({ sucess: true, comment: post });
            }
          }
        }
      }
    }
    console.log(data.comment + " test");
    console.log("jude");
  } else {
  }

  //   if (!session?.user) throw redirect(303, "/auth");

  //should prob check other stuff just in case
  return json({ sucess: false });
  //return json(newList.value + " test");
}) satisfies RequestHandler;
