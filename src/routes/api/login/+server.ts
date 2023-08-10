import Auth from "@auth/core";

import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import * as bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { signIn } from "@auth/sveltekit/client";

const prisma = new PrismaClient();

export const POST = (async ({ cookies, request }) => {
  const data = await request.json();
  //   signIn("credentials", {
  //     callbackUrl: "/",
  //     redirect: false,
  //     username: "password",
  //     password: "password",
  //   });
  return json({ sucess: true });
}) satisfies RequestHandler;
