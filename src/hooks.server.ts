import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/core/providers/google";
import { id, gsecret } from "$env/static/private";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const handle = SvelteKitAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google({ clientId: id, clientSecret: gsecret })],
});
