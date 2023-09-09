import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function postExists(id: string) {
  if (id) {
    const post = await prisma.post.findUnique({ where: { id } });
    return post ? true : false;
  } else {
    return false;
  }
}

export async function getComments(id: string) {
  if (await postExists(id)) {
    const comments = await prisma.comment.findMany({
      where: { post_id: id, reply: false },
      include: {
        User: true,
        Replies: {
          include: {
            User: true,
            Replies: { include: { User: true, Replies: true } },
          },
        },
      },
    });
    if (comments) {
      return comments;
    }
  }
  return null;
}

export async function getReplies(id: string) {
  const replies = await prisma.comment.findMany({
    where: { id: id },
    include: {
      User: true,
      Replies: {
        include: {
          User: true,
          Replies: {
            include: {
              User: true,
              Replies: { include: { User: true, Replies: true } },
            },
          },
        },
      },
    },
  });

  if (replies) {
    //return parents

    return replies[0].Replies;
  }
  return null;
}
