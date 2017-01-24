import { IMetadata } from '../interfaces';
import { Visibility } from './';

export default class Metadata implements IMetadata {
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

    constructor(paramaters: {
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
    }) {
        this.name = paramaters.name;
        this.ext = paramaters.ext;
        this.path = paramaters.path;
        this.parentDir = paramaters.parentDir;
        this.visibility = paramaters.visibility;
        this.size = paramaters.size;
        this.isFile = paramaters.isFile;
        this.isDir = paramaters.isDir;
        this.timestamp = paramaters.timestamp;
        this.mimetype = paramaters.mimetype;
    }
}
