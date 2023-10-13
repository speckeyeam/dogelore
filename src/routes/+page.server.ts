import { error } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import { getPosts } from "$lib/server/server";
import * as AWS from "aws-sdk";
import {
  getComments,
  getReplies,
  commentExists,
  postExists,
} from "$lib/server/server";
export const load = async ({ cookies, url }: { cookies: any; url: any }) => {
  const posts = await getPosts();
  if (posts) {
    return {
      posts,
    };
  }

  throw error(404, "Not found");
};
