import { Writable } from 'stream';

import IMetadata from './metadata';
import IReadOnly from './read-only';

declare interface IAdapter extends IReadOnly {
    /**
     * Write a new file.
     */
    write(path: string, contents: string): Promise<IMetadata>;

    /**
     * Write a new file using a stream.
     */
    writeStream(path: string, stream: Writable): Promise<IMetadata>;

    /**
     * Update a file.
     */
    update(path: string, contents: string): Promise<IMetadata>;

    /**
     * Update a file using a stream.
     */
    updateStream(path: string, stream: Writable): Promise<IMetadata>;

    /**
     * Rename a file.
     */
    rename(oldPath: string, newPath: string): Promise<boolean>;

    /**
     * Copy a file.
     */
    copy(oldPath: string, clonedPath: string): Promise<boolean>;

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
    createDir(path: string): Promise<boolean>;

    /**
     * Set the visibility for a file.
     */
    setVisibility(path: string, visibility: string): Promise<boolean>;
}

export default IAdapter;
