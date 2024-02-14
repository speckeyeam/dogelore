import type { RequestEvent, RequestHandler } from "../$types";
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

//CHECK IF FOLDER EXISTS
export const POST: RequestHandler = async (event: RequestEvent) => {
  const session = await event.locals.getSession();

  if (session?.user) {
    const data = await event.request.formData();
    // console.log([...data]);
    const file: any = data.get("file");
    const title = data.get("title");
    const folder = data.get("folderId");
    const text = data.get("text");

    if (file && title) {
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
              ContentType: file.type,
            };

            s3.upload(uploadParams, async function (err: any, data: any) {
              if (err) {
                return reject(err);
              } else {
              }
              if (data) {
                //console.log(data);
                return resolve(data);
              }
            });
          } catch (err) {
            return reject(err);
          }
        });
      };

      let i;

      const arrayBuffer = await file.arrayBuffer();
      let boofer = Buffer.from(arrayBuffer);

      if (
        Buffer.byteLength(boofer) > 5368709120 ||
        !file?.type.includes("image/")
      ) {
        return json({ sucess: false, fileError: true });
      }

      if (title.length > 150) {
        return json({ sucess: false, titleTooLong: true });
      }

      let fileType = ".webp";
      if (file.type.includes("image")) {
        const entryId = uuidv4();

        await uploadFile(file, "folder/" + entryId + fileType);
        const entry = await prisma.entry.create({
          data: {
            id: entryId,
            folderId: folder,
            userId: session.user.id,
            title: title.toString(),
            date: new Date(),
          },
        });
        if (entry) {
          return json({ sucess: true, entry });
        }
      }

      //makes gifs work
    }
  } else {
  }

  //   if (!session?.user) throw redirect(303, "/auth");

  //should prob check other stuff just in case
  return json({ sucess: false });
  //return json(newList.value + " test");
};
