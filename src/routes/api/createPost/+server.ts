import type { RequestEvent, RequestHandler } from "./$types";
import json from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import * as AWS from "aws-sdk";
import * as fs from "fs";
// import { ACCESS_KEY, AWS_REGION } from "$env/static/private";
// import { SECRET_ACCESS_KEY } from "$env/static/private";
import { v4 as uuidv4 } from "uuid";
import { User } from "$lib/components/interface.ts";
const prisma = new PrismaClient();

export const POST: RequestHandler = async (event: RequestEvent) => {
  const session = await event.locals.getSession();

  if (session?.user) {
    const data = await event.request.formData();
    // console.log([...data]);
    const files: any = data.getAll("file");
    const title = data.get("title");
    const text = data.get("text");

    if (files.length > 0 && title) {
      //do s3 stuff
      let accessKeyId;
      let secretAccessKey;

      const s3 = new AWS.S3({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      });

      const uploadFile = async (file: any, keyName: any) => {
        const arrayBuffer = await file.arrayBuffer();

        return new Promise((resolve, reject) => {
          try {
            const BUCKET = "dogelore";

            const uploadParams = {
              Bucket: BUCKET,
              Key: keyName,
              Body: Buffer.from(arrayBuffer),
            };

            s3.upload(uploadParams, function (err: any, data: any) {
              if (err) {
                return reject(err);
              }
              if (data) {
                return resolve(data);
              }
            });
          } catch (err) {
            return reject(err);
          }
        });
      };

      let i;
      for (i = 0; i < files.length; i++) {
        let file: any = files[i];
        const arrayBuffer = await file.arrayBuffer();
        let boofer = Buffer.from(arrayBuffer);
        if (
          Buffer.byteLength(boofer) > 5368709120 ||
          !(file?.type.includes("video/") || file?.type.includes("image/"))
        ) {
          files.splice(i, 1);
        }
      }
      if (files.length > 50) {
        return json({ sucess: false, tooManyImages: true });
      }
      if (title.length > 150) {
        return json({ sucess: false, titleTooLong: true });
      }
      const foldername = uuidv4();
      const post = await prisma.post.create({
        data: {
          id: foldername,
          userId: session.user.id,
          file: true,
          title: title.toString(),
          date: new Date(),
        },
      });
      if (!post) {
        return json({ sucess: false, prismaL: true });
      }
      let fileType: string = "";
      for (i = 0; i < files.length; i++) {
        if (files[i].type.includes("video")) {
          fileType = "." + files[i].type.replace("video/", "");
          console.log(fileType + "TEST");
          uploadFile(files[i], foldername + "/" + i + fileType);
        } else {
          fileType = ".jpg";
          uploadFile(files[i], foldername + "/" + i + fileType);
        }

        const post = await prisma.postFiles.create({
          data: {
            id: foldername,
            postFileName: foldername + "/" + i + fileType,
          },
        });
        //makes gifs work
      }
      return json({ sucess: true, id: post.id });
    } else if (title && text) {
      if (text.length < 2000 && text.length > 0) {
        const id = uuidv4();

        const post = await prisma.post.create({
          data: {
            id,
            userId: session.user.id,
            file: false,
            title: title.toString(),
            text: text.toString(),
            date: new Date(),
          },
        });

        if (!post) {
          return json({ sucess: false, prismaL: true });
        } else {
          return json({ sucess: true, id: post.id });
        }
      }
    }
  } else {
  }

  //   if (!session?.user) throw redirect(303, "/auth");

  //should prob check other stuff just in case
  return json({ sucess: false });
  //return json(newList.value + " test");
};
