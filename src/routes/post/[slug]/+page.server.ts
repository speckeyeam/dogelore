import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { PrismaClient } from "@prisma/client";
import * as AWS from "aws-sdk";
import { ACCESS_KEY } from "$env/static/private";
import { SECRET_ACCESS_KEY } from "$env/static/private";

export const load = (async ({ params, cookies }) => {
  let valid;

  const prisma = new PrismaClient();

  const postId: string = params.slug;

  if (postId) {
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
      },
    });

    if (post) {
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

        // data.Contents.forEach(function (obj, index) {
        //   console.log(index);
        // });
      });
    }

    // s3.listObjectsV2(params, function (err, data) {
    //   if (err) console.log(err, err.stack); // an error occurred
    //   else console.log(data); // successful response
    // });

    //get posts
  }
  throw error(404, "Not found");
}) satisfies PageServerLoad;