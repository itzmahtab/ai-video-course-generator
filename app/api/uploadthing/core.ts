import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

/**
 * Fake auth for now
 * Replace later with real auth (Clerk / NextAuth / JWT)
 */
const auth = async (req: Request) => {
  return { id: "fakeId" };
};

export const ourFileRouter = {
  /**
   * -------------------------
   * IMAGE UPLOADER (unchanged)
   * -------------------------
   */
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ Image uploaded by:", metadata.userId);
      console.log("🖼️ Image URL:", file.ufsUrl);

      return {
        url: file.ufsUrl,
        uploadedBy: metadata.userId,
      };
    }),

  /**
   * -------------------------
   * AUDIO UPLOADER (NEW)
   * -------------------------
   */
  audioUploader: f({
    audio: {
      maxFileSize: "32MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("🎧 Audio uploaded by:", metadata.userId);
      console.log("🔊 Audio URL:", file.ufsUrl);

      return {
        audioUrl: file.ufsUrl,
        uploadedBy: metadata.userId,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
