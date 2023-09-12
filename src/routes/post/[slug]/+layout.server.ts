import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { PrismaClient } from "@prisma/client";
import * as AWS from "aws-sdk";
import { ACCESS_KEY } from "$env/static/private";
import { SECRET_ACCESS_KEY } from "$env/static/private";
import { getComments, getReplies, commentExists } from "$lib/server/server";
export const load = (async ({ params, cookies, url }) => {
  let theurl = url.searchParams.get("comment");
  let valid;

  const prisma = new PrismaClient();
  let comments: any;

  const postId: string = params.slug;

  if (postId) {
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
      },
    });

    if (post) {
      if (theurl) {
        comments = await getReplies(theurl);
      } else {
        comments = await getComments(post.id);
      }
      if (post.file) {
        const prefix = post.id + "/";
        const params = {
          Bucket: "dogelore" /* required */,
          Prefix: prefix, // Can be your folder name
        };

        const s3 = new AWS.S3({
          accessKeyId: ACCESS_KEY || process.env.ACCESS_KEY,
          secretAccessKey: SECRET_ACCESS_KEY || process.env.SECRET_ACCESS_KEY,
        });

        s3.listObjectsV2(params, function (err, data) {
          if (err) {
            console.log(err, err.stack);
          } // an error occurred

          console.log(data);
          const keyArray: string[] = [];
          data.Contents.forEach(function (obj, index) {
            console.log(obj.Key, "<<<file path");
            keyArray.push("https://dogelore.s3.amazonaws.com/" + obj.Key);
          });
          return {
            data: keyArray,
          };
          // data.Contents.forEach(function (obj, index) {
          //   console.log(index);
          // });
        });
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
}) satisfies PageServerLoad;
