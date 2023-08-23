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
