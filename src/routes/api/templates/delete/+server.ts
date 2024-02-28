import { json } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import type { RequestEvent, RequestHandler } from "./$types";
import { folderExists, entryExists } from "$lib/server/server";
const prisma = new PrismaClient();

export const POST: RequestHandler = async (event: RequestEvent) => {
  const session = await event.locals.getSession();

  if (session?.user) {
    const data = await event.request.json();
    let id = data.id;
    let isTemplate = data.isTemplate;

    if (isTemplate) {
      let folder = await folderExists(id);
      if (folder) {
        if (session?.user.id == folder.userId) {
          const entries = await prisma.entry.deleteMany({
            where: {
              folderId: folder.id,
            },
          });
          const delete_folder = await prisma.folder.delete({
            where: {
              id: folder.id,
            },
          });
          return json({ success: true });
        }
      }
    } else {
      let entry = await entryExists(id);
      if (entry) {
        if (session?.user.id == entry.folder.userId) {
          const entry = await prisma.entry.delete({
            where: {
              id: folder.id,
            },
          });
        }
      }
    }
  }

  //   if (!session?.user) throw redirect(303, "/auth");

  //should prob check other stuff just in case
  return json({ success: false });
  //return json(newList.value + " test");
};
