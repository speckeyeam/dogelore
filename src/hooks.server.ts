import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/core/providers/google";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let id;
let gsecret;

// Dynamically import the environment variables
import("$env/static/private").then(
  ({ id: importedId, gsecret: importedGsecret }) => {
    id = importedId || "default-id";
    gsecret = importedGsecret || "default-gsecret";

    // You can start your tests here or call a function to begin testing
    // e.g., startTests();
  }
);
export const handle = SvelteKitAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.id || id,
      clientSecret: process.env.gsecret || gsecret,
    }),
  ],
});
