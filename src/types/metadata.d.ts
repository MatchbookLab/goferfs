declare interface IMetadata {
    name: string;
    ext: string;
    path: string;
    parentDir: string;
    size: number;
    isFile: boolean;
    isDir: boolean;
    timestamp: Date;
    mimetype: string;
}

export default IMetadata;
