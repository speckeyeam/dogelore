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
    let isFolder = data.isFolder;

    if (isFolder) {
      let fetch = await folderExists(id);
      let folder = await fetch.json();
      if (folder.folder) {
        console.log("test");
        if (session?.user.id == folder.folder.userId) {
          const entries = await prisma.entry.deleteMany({
            where: {
              folderId: folder.folder.id,
            },
          });
          const delete_folder = await prisma.folder.delete({
            where: {
              id: folder.folder.id,
            },
          });
          return json({ success: true, folder: delete_folder });
        }
      }
    } else {
      let entry = await entryExists(id);
      if (entry) {
        if (session?.user.id == entry.folder.userId) {
          const entry = await prisma.entry.delete({
            where: {
              id: id,
            },
          });
          return json({ success: true, entry });
        }
      }
    }
  }

  //   if (!session?.user) throw redirect(303, "/auth");

  //should prob check other stuff just in case
  return json({ success: false });
  //return json(newList.value + " test");
};
