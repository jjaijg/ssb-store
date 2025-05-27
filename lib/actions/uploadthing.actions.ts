"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deleteUploadThingFile(url: string) {
  try {
    const fileKey = url.split("/").pop();
    if (!fileKey) {
      throw new Error("Invalid file URL");
    }
    await utapi.deleteFiles(fileKey);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}
