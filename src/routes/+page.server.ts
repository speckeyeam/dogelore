import { error } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import { getPosts2 } from "$lib/server/server";
import {
  getComments,
  getReplies,
  commentExists,
  postExists,
} from "$lib/server/server";
export const load = async ({ cookies, url }: { cookies: any; url: any }) => {
  const posts = await getPosts2();
  if (posts) {
    return {
      posts,
    };
  }

  throw error(404, "Not found");
};
