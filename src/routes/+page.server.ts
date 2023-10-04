import { error } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import * as AWS from "aws-sdk";
import { ACCESS_KEY } from "$env/static/private";
import { SECRET_ACCESS_KEY } from "$env/static/private";
import {
  getComments,
  getReplies,
  commentExists,
  postExists,
} from "$lib/server/server";
export const load = async ({ cookies, url }: { cookies: any; url: any }) => {
  return {
    posts: "balls",

    //get
  };
  throw error(404, "Not found");
};
