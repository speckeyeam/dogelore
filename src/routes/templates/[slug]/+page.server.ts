import { error } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import * as AWS from "aws-sdk";

import { folderExists } from "$lib/server/server";
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

  const folderId: string = params.slug;

  if (folderId) {
    console.log(folderId);
    const folder = await folderExists(Number(folderId));

    if (folder) {
      return {
        data: folder,
      };
    } else {
      return {
        penis: true,
      };
    }
  }

  throw error(404, "Not found");
};
