import { dirname } from 'path';
import * as Stream from 'stream';

import { IMetadata, IFile, IStreamFile, IFilesystem, IAdapter } from '../interfaces';
import { Visibility } from '../types';

export * from '../types';

export default class Gofer implements IFilesystem {
    private adapter: IAdapter;

    constructor (adapter: IAdapter) {
        this.adapter = adapter;
    }

    async write(path: string, contents: string, options?: { visibility?: Visibility }): Promise<IMetadata> {
        path = this.cleanPath(path);

        await this.ensureDirectory(path);

        return this.adapter.write(path, contents, options);
    }

    async writeStream(path: string, stream: Stream, options?: { visibility?: Visibility }): Promise<IMetadata> {
        path = this.cleanPath(path);

        await this.ensureDirectory(path);

        return this.adapter.writeStream(path, stream, options);
    }

    exists(path: string): Promise<boolean> {
        path = this.cleanPath(path);
        return this.adapter.exists(path);
    }

    read(path: string): Promise<IFile> {
        path = this.cleanPath(path);
        return this.adapter.read(path);
    }

    readStream(path: string): Promise<IStreamFile> {
        path = this.cleanPath(path);
        return this.adapter.readStream(path);
    }

    getMetadata(path: string): Promise<IMetadata> {
        path = this.cleanPath(path);
        return this.adapter.getMetadata(path);
    }

    getVisibility(path: string): Promise<Visibility> {
        path = this.cleanPath(path);
        return this.adapter.getVisibility(path);
    }

    move(oldPath: string, newPath: string): Promise<IMetadata> {
        oldPath = this.cleanPath(oldPath);
        newPath = this.cleanPath(newPath);

        return this.adapter.move(oldPath, newPath);
    }

    copy(oldPath: string, clonedPath: string): Promise<IMetadata> {
        oldPath = this.cleanPath(oldPath);
        clonedPath = this.cleanPath(clonedPath);

        return this.adapter.copy(oldPath, clonedPath);
    }

    async delete(path: string): Promise<boolean> {
        path = this.cleanPath(path);

        if (!(await this.exists(path))) {
            // nothing was deleted as it doesn't exist
            return false;
        }

        return this.adapter.delete(path);
    }

    deleteDir(path: string): Promise<boolean> {
        path = this.cleanPath(path);
        return this.adapter.deleteDir(path);
    }

    async createDir(path: string): Promise<IMetadata> {
        path = this.cleanPath(path);

        if (!(await this.exists(path))) {
            return this.adapter.createDir(path);
        }

        // already exists
        return null;
    }

    setVisibility(path: string, visibility: Visibility): Promise<IMetadata> {
        path = this.cleanPath(path);
        return this.adapter.setVisibility(path, visibility);
    }

    private ensureDirectory(path: string) {
        path = this.cleanPath(path);
        const dir = dirname(path);
        return this.createDir(dir);
    }

    private cleanPath(path: string): string {
        return path.replace(/^\.?\/+/, '');
    }
}
