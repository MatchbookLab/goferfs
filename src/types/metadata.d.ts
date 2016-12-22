declare interface IMetadata {
    name: string;
    basename: string;
    ext: string;
    path: string;
    parentDir: string;
    size: number;
    isFile: boolean;
    isDirectory: boolean;
    timestamp: Date;
    mimetype: string;
}

export default IMetadata;
