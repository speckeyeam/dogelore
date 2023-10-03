import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/core/providers/google";
import Credentials from "@auth/core/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let id;
let gsecret;

// Dynamically import the environment variables
import("$env/static/private").then(
  ({ id: importedId, gsecret: importedGsecret }) => {
    id = importedId || process.env.id;
    gsecret = importedGsecret || "default-gsecret";

    // You can start your tests here or call a function to begin testing
    // e.g., startTests();
  }
);
export const handle = SvelteKitAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      };
      return session;
    },
  },
  providers: [
    Google({
      clientId: process.env.id || id,
      clientSecret: process.env.gsecret || gsecret,
    }),
  ],
});
