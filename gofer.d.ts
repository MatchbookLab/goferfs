import * as Stream from 'stream';

import { IFilesystem, IAdapter, IMetadata, IFile, IStreamFile } from './interfaces';
import { Visibility } from './types';

export default class Gofer implements IFilesystem {
    targetVersion: string;

    constructor(adapter: IAdapter);

    exists(path: string): Promise<boolean>;

    read(path: string): Promise<IFile>;

    readStream(path: string): Promise<IStreamFile>;

    getMetadata(path: string): Promise<IMetadata>;

    getVisibility(path: string): Promise<Visibility>;

    write(path: string, contents: string, options?: { visibility?: Visibility }): Promise<IMetadata>;

    writeStream(path: string, stream: Stream, options?: { visibility?: Visibility }): Promise<IMetadata>;

    move(oldPath: string, newPath: string): Promise<IMetadata>;

    copy(oldPath: string, clonedPath: string): Promise<IMetadata>;

    delete(path: string): Promise<boolean>;

    deleteDir(path: string): Promise<boolean>;

    createDir(path: string): Promise<IMetadata>;

    setVisibility(path: string, visibility: Visibility): Promise<IMetadata>;
}

export * from './types';
