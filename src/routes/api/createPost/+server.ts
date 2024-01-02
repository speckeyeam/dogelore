import type { RequestEvent, RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import * as AWS from "aws-sdk";
import S3 from "aws-sdk/clients/s3.js";
import * as fs from "fs";
import sharp from "sharp";
// import { ACCESS_KEY, AWS_REGION } from "$env/static/private";
// import { SECRET_ACCESS_KEY } from "$env/static/private";
import { v4 as uuidv4 } from "uuid";
// import { User } from "$lib/components/interface";
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

      const s3 = new S3({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      });

      const uploadFile = async (file: any, keyName: any) => {
        //const arrayBuffer = await file.arrayBuffer();

        const arrayBuffer = await file.arrayBuffer();
        let buffer = Buffer.from(arrayBuffer);

        // Check if the file is an image and compress it
        if (file.type.includes("image/")) {
          try {
            buffer = await sharp(buffer).toFormat("webp").toBuffer();
            fileType = ".webp"; // Update file type to webp
          } catch (error) {
            console.error("Error converting image to WebP:", error);
            // Handle the error as per your application's requirement
          }
        }

        return new Promise((resolve, reject) => {
          try {
            const BUCKET = "dogelore";

            const uploadParams = {
              Bucket: BUCKET,
              Key: keyName,
              Body: buffer,
              Metadata: {
                fileType: file.type,
              },
            };

            s3.upload(uploadParams, async function (err: any, data: any) {
              if (err) {
                return reject(err);
              } else {
                const postFiles = await prisma.PostFiles.create({
                  data: {
                    postId: foldername,
                    postFileName: foldername + "/" + i + fileType,
                  },
                });
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
        } else {
          fileType = ".webp";
        }
        await uploadFile(files[i], foldername + "/" + i + fileType);

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
  json({ sucess: false });
  //return json(newList.value + " test");
};
