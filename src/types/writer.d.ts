import * as Stream from 'stream';

import IMetadata from './metadata';
import {IAdapter} from "./";

declare interface IWriter extends IAdapter {
    /**
     * Write a file.
     */
    write(path: string, contents: string): Promise<IMetadata>;

    /**
     * Write a file using a stream.
     */
    writeStream(path: string, stream: Stream): Promise<IMetadata>;

    /**
     * Rename a file.
     */
    move(oldPath: string, newPath: string): Promise<IMetadata>;

    /**
     * Copy a file.
     */
    copy(oldPath: string, clonedPath: string): Promise<IMetadata>;

    /**
     * Delete a file.
     */
    delete(path: string): Promise<boolean>;

    /**
     * Delete a directory.
     */
    deleteDir(path: string): Promise<boolean>;

    /**
     * Create a directory.
     */
    createDir(path: string): Promise<IMetadata>;

    /**
     * Set the visibility for a file.
     */
    setVisibility(path: string, visibility: string): Promise<IMetadata>;
}

export default IWriter;
