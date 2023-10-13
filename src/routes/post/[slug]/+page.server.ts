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
        if (post.Files) {
          console.log("test");
        } else {
          console.log("fail");
        }
        console.log(post);
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

    // s3.listObjectsV2(params, function (err, data) {
    //   if (err) console.log(err, err.stack); // an error occurred
    //   else console.log(data); // successful response
    // });

    //get posts
  }

  throw error(404, "Not found");
};
