import { json } from "@sveltejs/kit";

import { PrismaClient } from "@prisma/client";
import type { RequestEvent, RequestHandler } from "./$types";
import { commentExists } from "$lib/server/server";
const prisma = new PrismaClient();

export const POST: RequestHandler = async (event: RequestEvent) => {
  const session = await event.locals.getSession();

  console.log(session);
  if (session) {
    const data = await event.request.json();

    let comment_id = data.comment_id;

    let id: string = session.user.id + comment_id;
    if (await commentExists(comment_id)) {
      const like = await prisma.comment_likes.findUnique({
        where: { id },
      });
      const dislike = await prisma.comment_dislikes.findUnique({
        where: { id },
      });
      if (data.like) {
        if (like) {
          const deleteLike = await prisma.comment_likes.deleteMany({
            where: { id },
          });
          return json({ success: true, deselect: true });
        } else {
          const createLike = await prisma.comment_likes.create({
            data: {
              id,
              commentId: comment_id,
            },
          });
        }

        const deleteDislike = await prisma.comment_dislikes.deleteMany({
          where: { id },
        });
        return json({ success: true, like: true });
      } else {
        if (dislike) {
          const deleteDislike = await prisma.comment_dislikes.deleteMany({
            where: { id },
          });

          return json({ success: true, deselect: true });
        } else {
          const createDislike = await prisma.comment_dislikes.create({
            data: {
              id,
              commentId: comment_id,
            },
          });
        }

        const deleteLike = await prisma.comment_likes.deleteMany({
          where: { id },
        });
        return json({ success: true, dislike: true });
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
};
