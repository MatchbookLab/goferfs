import * as Stream from 'stream';
import { IStreamFile, IMetadata } from './types';

export default class StreamFile implements IStreamFile {
    stream: Stream;
    name: string;
    ext: string;
    path: string;
    parentDir: string;
    size: number;
    isFile: boolean;
    isDir: boolean;
    timestamp: Date;
    mimetype: string;

    constructor(metadata: IMetadata, stream: Stream) {
        this.stream = stream;

        this.name = metadata.name;
        this.ext = metadata.ext;
        this.path = metadata.path;
        this.parentDir = metadata.parentDir;
        this.size = metadata.size;
        this.isFile = metadata.isFile;
        this.isDir = metadata.isDir;
        this.timestamp = metadata.timestamp;
        this.mimetype = metadata.mimetype;
    }
}
