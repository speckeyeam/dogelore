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
    id = importedId || "default-id";
    gsecret = importedGsecret || "default-gsecret";

    // You can start your tests here or call a function to begin testing
    // e.g., startTests();
  }
);
export const handle = SvelteKitAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 300000,
  },
  providers: [
    Google({
      clientId: process.env.id || id,
      clientSecret: process.env.gsecret || gsecret,
    }),
    Credentials({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = {
          id: "clkxn0im80000s9817axp8jac",
          name: "Hot ASRY",
          email: "dicklung212@gmail.com",
        };

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
});
