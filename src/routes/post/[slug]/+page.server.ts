import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, cookies }) => {
  let valid;

  const post: string = +params.slug;
  if (post) {
    //get posts
  }
  throw error(404, "Not found");
}) satisfies PageServerLoad;
