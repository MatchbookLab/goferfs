import IMetadata from './metadata';
import IFile from './file';
import IStreamFile from './stream-file';
import {IAdapter} from "./";

declare interface IReader extends IAdapter {
    /**
     * Read a file.
     */
    read(path: string): Promise<IFile>;

    /**
     * Read a file as a stream.
     */
    readStream(path: string): Promise<IStreamFile>;

    /**
     * List contents of a directory.
     */
    listContents(directory: string, recursive: boolean): Promise<Array<IMetadata>>;

    /**
     * Get all the meta data of a file or directory.
     */
    getMetadata(path: string): Promise<IMetadata>;

    /**
     * Get all the meta data of a file or directory.
     */
    getSize(path: string): Promise<number>;

    /**
     * Get the mimetype of a file.
     */
    getMimetype(path: string): Promise<string>;

    /**
     * Get the timestamp of a file.
     */
    getTimestamp(path: string): Promise<Date>;

    /**
     * Get the visibility of a file.
     */
    getVisibility(path: string): Promise<string>;
}

export default IReader;
