import IAdapter from './adapter';
import IMetadata from './metadata';
import * as Stream from 'stream';

declare interface IFilesystem extends IAdapter {
    /**
     * Write a new file.
     */
    put(path: string, contents: string): Promise<IMetadata>;

    /**
     * Write a new file using a stream.
     */
    putStream(path: string, stream: Stream): Promise<IMetadata>;

    /**
     * Write a new file.
     */
    update(path: string, contents: string): Promise<IMetadata>;

    /**
     * Write a new file using a stream.
     */
    updateStream(path: string, stream: Stream): Promise<IMetadata>;
}

export default IFilesystem;
