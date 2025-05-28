"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deleteUploadThingFile(url: string | string[]) {
  try {
    const urls = Array.isArray(url) ? url : [url];
    const fileKeys = urls
      .map((url) => url.split("/").pop())
      .filter((url) => typeof url === "string");

    if (fileKeys.length === 0) {
      throw new Error("Invalid file URL");
    }
    await utapi.deleteFiles(fileKeys);
    return true;
  } catch (error) {
    console.error("Error deleting files:", error);
    return false;
  }
}
