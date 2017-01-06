import IAdapter from './adapter';
import IMetadata from './metadata';
import * as Stream from 'stream';

declare interface IFilesystem extends IAdapter {
    /**
     * Create a new file.
     */
    create(path: string, contents: string): Promise<IMetadata>;

    /**
     * Create a new file using a stream.
     */
    createStream(path: string, stream: Stream): Promise<IMetadata>;

    /**
     * Update an existing file.
     */
    update(path: string, contents: string): Promise<IMetadata>;

    /**
     * Update an existing file using a stream.
     */
    updateStream(path: string, stream: Stream): Promise<IMetadata>;
}

export default IFilesystem;
