import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { PrismaClient } from "@prisma/client";
import type { RequestEvent } from "./$types";
import { postExists } from "$lib/server/server";

const prisma = new PrismaClient();

export const POST = (async (event: RequestEvent) => {
  const session = await event.locals.getSession();

  console.log(session);
  if (session) {
    const data = await event.request.json();

    let post_id = data.post_id;

    let id: String = session.user.id + post_id;
    if (await postExists(post_id)) {
      const like = await prisma.post_likes.findUnique({
        where: { id },
      });
      const dislike = await prisma.post_dislikes.findUnique({
        where: { id },
      });
      if (data.like) {
        if (like) {
          const deleteLike = await prisma.post_likes.deleteMany({
            where: { id },
          });
          return json({ success: true, deselect: true });
        } else {
          const createLike = await prisma.post_likes.create({
            data: {
              id,
              postId: post_id,
            },
          });
        }

        const deleteDislike = await prisma.post_dislikes.deleteMany({
          where: { id },
        });
        return json({ success: true, like: true });
      } else {
        if (dislike) {
          const deleteDislike = await prisma.post_dislikes.deleteMany({
            where: { id },
          });

          return json({ success: true, deselect: true });
        } else {
          const createDislike = await prisma.post_dislikes.create({
            data: {
              id,
              postId: post_id,
            },
          });
        }

        const deleteLike = await prisma.post_likes.deleteMany({
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
}) satisfies RequestHandler;
