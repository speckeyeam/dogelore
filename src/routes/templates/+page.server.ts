import { error } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import * as AWS from "aws-sdk";
import type { PageServerLoad } from "./$types";

import { getRootFolders } from "$lib/server/server";
export const load: PageServerLoad = async ({ cookies }: { cookies: any }) => {
  let valid;

  const prisma = new PrismaClient();

  const folders = await getRootFolders();

  if (folders) {
    return {
      folders,
    };
  } else {
    return {
      penis: true,
    };
  }

  throw error(404, "Not found");
};
