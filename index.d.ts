/// <reference types="node" />
import type { File } from "@google-cloud/storage";
import type { Readable } from "stream";
export declare type UploadHandlerArgs = {
    name: string;
    stream: Readable;
    filename: string;
    encoding: string;
    mimetype: string;
};
export declare type UploadHandler = (args: UploadHandlerArgs) => Promise<string | File | undefined>;
export declare type FirebaseStorageUploadHandler = {
    file(args: UploadHandlerArgs): File;
    filter?(args: UploadHandlerArgs): boolean | Promise<boolean>;
};
export default function createFirebaseStorageFileHandler({ file, filter, }: FirebaseStorageUploadHandler): UploadHandler;
