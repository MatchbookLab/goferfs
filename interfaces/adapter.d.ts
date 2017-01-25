import * as Stream from 'stream';

import IMetadata from './metadata';
import IFile from './file';
import IStreamFile from './stream-file';
import Visibility from '../types/visibility';

declare interface IAdapter {
    ////////////////
    // PROPERTIES //
    ////////////////

    targetVersion: string;

    //////////////////
    // READ METHODS //
    //////////////////

    /**
     * Check whether a file exists.
     */
    exists(path: string): Promise<boolean>;

    /**
     * Read a file.
     */
    read(path: string): Promise<IFile>;

    /**
     * Read a file as a stream.
     */
    readStream(path: string): Promise<IStreamFile>;

    /**
     * Get all the meta data of a file or directory.
     */
    getMetadata(path: string): Promise<IMetadata>;

    /**
     * Get the visibility of a file.
     */
    getVisibility(path: string): Promise<Visibility>;

    ///////////////////
    // WRITE METHODS //
    ///////////////////

    /**
     * Write a file.
     */
    write(path: string, contents: string, options?: { visibility?: Visibility }): Promise<IMetadata>;

    /**
     * Write a file using a stream.
     */
    writeStream(path: string, stream: Stream, options?: { visibility?: Visibility }): Promise<IMetadata>;

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
    setVisibility(path: string, visibility: Visibility): Promise<IMetadata>;
}

export default IAdapter;
