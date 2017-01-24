import * as Stream from 'stream';

import { IStreamFile, IMetadata } from '../interfaces';
import { Visibility } from './';

export default class StreamFile implements IStreamFile {
    stream: Stream;
    name: string;
    ext: string;
    path: string;
    parentDir: string;
    visibility: Visibility;
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
        this.visibility = metadata.visibility;
        this.size = metadata.size;
        this.isFile = metadata.isFile;
        this.isDir = metadata.isDir;
        this.timestamp = metadata.timestamp;
        this.mimetype = metadata.mimetype;
    }
}
