import { IMetadata } from './types';

export default class Metadata implements IMetadata {
    name: string;
    ext: string;
    path: string;
    parentDir: string;
    size: number;
    isFile: boolean;
    isDir: boolean;
    timestamp: Date;
    mimetype: string;

    constructor(paramaters: {
        name: string;
        ext: string;
        path: string;
        parentDir: string;
        size: number;
        isFile: boolean;
        isDir: boolean;
        timestamp: Date;
        mimetype: string;
    }) {
        this.name = paramaters.name;
        this.ext = paramaters.ext;
        this.path = paramaters.path;
        this.parentDir = paramaters.parentDir;
        this.size = paramaters.size;
        this.isFile = paramaters.isFile;
        this.isDir = paramaters.isDir;
        this.timestamp = paramaters.timestamp;
        this.mimetype = paramaters.mimetype;
    }
}
