import { PrismaClient } from "@prisma/client";
import { json } from "@sveltejs/kit";
const prisma = new PrismaClient();

// await prisma.folder.deleteMany({});
export async function postExists(id: string) {
  if (id) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { Likes: true, Dislikes: true, User: true, Files: true },
    });
    return post ? post : false;
  } else {
    return false;
  }
}

export async function folderExists(id: number) {
  if (id != null) {
    const folder = await prisma.folder.findUnique({
      where: { id },
      include: { entries: true },
    });

    const children = await prisma.folder.findMany({
      where: { parentId: id },
      include: { entries: true },
    });

    return folder ? json({ folder, children }) : false;
  } else {
    return false;
  }
}

export async function entryExists(id: string) {
  if (id != null) {
    const entry = await prisma.entry.findUnique({
      where: { id },
      include: { folder: true },
    });

    return entry ? entry : false;
  } else {
    return false;
  }
}

export async function getRootFolders(id: string) {
  if (id) {
    const folder = await prisma.folder.findMany({
      skip: 1,
      take: 10,
      cursor: {
        id: id,
      },
      where: { parentId: null },
      include: { entries: true },
    });

    return folder ? folder : false;
  } else {
    const folder = await prisma.folder.findMany({
      where: { parentId: 0 },
      include: { entries: true },
    });

    return folder ? folder : false;
  }
}

export async function userExists(id: string) {
  if (id) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (user) {
      const returnedUser = { id: user?.id, Name: user?.name };
      return returnedUser ? returnedUser : false;
    }
    return false;
  } else {
    return false;
  }
}

export async function commentExists(id: string) {
  if (id) {
    const post = await prisma.comment.findUnique({ where: { id } });
    return post ? post : false;
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
        Likes: true,
        Dislikes: true,
        Replies: {
          include: {
            User: true,
            Likes: true,
            Dislikes: true,
            Replies: {
              include: {
                User: true,
                Replies: true,
                Likes: true,
                Dislikes: true,
              },
            },
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

export async function getPosts(id: string) {
  if (id) {
    const posts = await prisma.post.findMany({
      skip: 1,
      take: 10,
      cursor: {
        id: id,
      },
      include: {
        Files: true,
        User: true,
        Likes: true,
        Dislikes: true,
      },
      orderBy: {
        date: "asc",
      },
    });
    if (posts) {
      return posts;
    }
  } else {
    const posts = await prisma.post.findMany({
      take: 10,

      include: {
        Files: true,
        User: true,
        Likes: true,
        Dislikes: true,
      },
      orderBy: {
        date: "asc",
      },
    });
    if (posts) {
      return posts;
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
          Likes: true,
          Dislikes: true,
          Replies: {
            include: {
              User: true,
              Likes: true,
              Dislikes: true,
              Replies: {
                include: {
                  User: true,
                  Replies: true,
                  Likes: true,
                  Dislikes: true,
                },
              },
            },
          },
        },
      },
    },
  });
  //check to see if user liked comment or post and return bool if so.
  if (replies) {
    //return parents

    return replies[0].Replies;
  }
  return null;
}
