import { error } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import * as AWS from "aws-sdk";

import {
  getComments,
  getReplies,
  commentExists,
  postExists,
} from "$lib/server/server";
export const load = async ({
  params,
  cookies,
  url,
}: {
  params: any;
  cookies: any;
  url: any;
}) => {
  let theurl = url.searchParams.get("comment");
  let valid;

  const prisma = new PrismaClient();
  let comments: any;

  const postId: string = params.slug;

  if (postId) {
    const post = await postExists(postId);

    if (post) {
      if (theurl) {
        comments = await getReplies(theurl);
      } else {
        comments = await getComments(post.id);
      }
      if (post.file) {
        return {
          data: post,
          fileArray: post.Files,
          comments,
          viewComment: theurl,
        };
      } else {
        return {
          data: post,
          comments,
          viewComment: theurl,
        };
      }
    }
  }

  throw error(404, "Not found");
};
