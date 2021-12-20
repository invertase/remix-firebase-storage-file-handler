import type { File } from "@google-cloud/storage";
import type { Readable } from "stream";

// TODO from Remix once types available
export declare type UploadHandlerArgs = {
  name: string;
  stream: Readable;
  filename: string;
  encoding: string;
  mimetype: string;
};

// TODO from Remix once types available
export declare type UploadHandler = (
  args: UploadHandlerArgs
) => Promise<string | File | undefined>;

export type FirebaseStorageUploadHandler = {
  file(args: UploadHandlerArgs): File;
  filter?(args: UploadHandlerArgs): boolean | Promise<boolean>;
};

export default function createFirebaseStorageFileHandler({
  file,
  filter,
}: FirebaseStorageUploadHandler): UploadHandler {
  return async (args) => {
    const { stream, encoding, mimetype } = args;

    if (filter && !(await filter(args))) {
      stream.resume();
      return;
    }

    // Get the file as a buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    const instance = file(args);

    // Save the Buffer to the file
    await instance.save(buffer);

    // Add the known content type to the file
    await instance.setMetadata({
      "Content-Type": mimetype,
      "Content-Encoding": encoding,
    });

    // Make the file publicly readable - maintain other permissions
    // https://googleapis.dev/nodejs/storage/latest/File.html#makePublic
    await instance.makePublic();

    // Return the public URL
    return instance.publicUrl();
  };
}
