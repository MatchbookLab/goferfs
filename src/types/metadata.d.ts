import Visibility from './visibility';

declare interface IMetadata {
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
}

export default IMetadata;
