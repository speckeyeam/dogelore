import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { PrismaClient } from "@prisma/client";
import type { RequestEvent } from "./$types";
import * as AWS from "aws-sdk";
import * as fs from "fs";
import { ACCESS_KEY } from "$env/static/private";
import { SECRET_ACCESS_KEY } from "$env/static/private";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export const POST = (async (event: RequestEvent) => {
  const session = await event.locals.getSession();

  if (session?.user) {
    const data = await event.request.formData();
    //console.log([...data]);
    const files = data.getAll("file");
    const title = data.get("title");
    const array = [...files];
    console.log(files.length);
    if (files && title) {
      //do s3 stuff
      let accessKeyId;
      let secretAccessKey;

      const s3 = new AWS.S3({
        accessKeyId: ACCESS_KEY || process.env.ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY || process.env.SECRET_ACCESS_KEY,
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
        if (Buffer.byteLength(boofer) > 5368709120) {
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
      const post = await prisma.Post.create({
        data: {
          id: foldername,
          userId: session.user.id,
          file: true,
          title,
          date: new Date(),
        },
      });
      if (post) {
        return json({ sucess: false, prismaL: true });
      }
      for (i = 0; i < files.length; i++) {
        uploadFile(files[i], foldername + "/" + i + ".jpg");
      }
    }
  } else {
  }

  //   if (!session?.user) throw redirect(303, "/auth");

  //should prob check other stuff just in case
  return json({ sucess: true });
  //return json(newList.value + " test");
}) satisfies RequestHandler;
