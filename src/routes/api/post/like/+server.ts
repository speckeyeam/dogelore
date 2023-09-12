import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { PrismaClient } from "@prisma/client";
import type { RequestEvent } from "./$types";
import { commentExists } from "$lib/server/server";

const prisma = new PrismaClient();

export const POST = (async (event: RequestEvent) => {
  const session = await event.locals.getSession();

  if (session?.user) {
    const data = await event.request.json();

    let post_id = data.post_id;
    let like = data.like;
    let id: String = session.user.id + post_id;
    if (await commentExists(post_id)) {
      console.log("tset");
      const like = await prisma.comment_likes.findUnique({
        where: { id },
      });

      const dislike = await prisma.comment_dislikes.findUnique({
        where: { id },
      });
      if (data.like) {
        const createLike = await prisma.post_likes.create({
          data: {
            id,
            postId: post_id,
          },
        });

        const deleteDislike = await prisma.post_dislikes.delete({
          where: { id },
        });
      } else {
        const createDislike = await prisma.post_dislikes.create({
          data: {
            id,
            postId: post_id,
          },
        });

        const deleteLike = await prisma.post_likes.delete({
          where: { id },
        });
      }
    } else {
      return json({ success: false });
    }
  } else {
  }

  //   if (!session?.user) throw redirect(303, "/auth");

  //should prob check other stuff just in case
  return json({ sucess: false });
  //return json(newList.value + " test");
}) satisfies RequestHandler;
