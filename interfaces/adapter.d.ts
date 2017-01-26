import * as Stream from 'stream';

import { Metadata, File, StreamFile, Visibility } from '../types';

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
    read(path: string): Promise<File>;

    /**
     * Read a file as a stream.
     */
    readStream(path: string): Promise<StreamFile>;

    /**
     * Get all the meta data of a file or directory.
     */
    getMetadata(path: string): Promise<Metadata>;

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
    write(path: string, contents: string, options?: { visibility?: Visibility }): Promise<Metadata>;

    /**
     * Write a file using a stream.
     */
    writeStream(path: string, stream: Stream, options?: { visibility?: Visibility }): Promise<Metadata>;

    /**
     * Rename a file.
     */
    move(oldPath: string, newPath: string): Promise<Metadata>;

    /**
     * Copy a file.
     */
    copy(oldPath: string, clonedPath: string): Promise<Metadata>;

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
    createDir(path: string): Promise<Metadata>;

    /**
     * Set the visibility for a file.
     */
    setVisibility(path: string, visibility: Visibility): Promise<Metadata>;
}

export default IAdapter;
