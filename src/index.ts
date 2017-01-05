import { basename, resolve, dirname } from 'path';
import * as Stream from 'stream';

import { IMetadata, IFile, IStreamFile, IFilesystem, IAdapter } from './types';

export default class Filesystem implements IFilesystem {
    private adapter: IAdapter;

    constructor (adapter: IAdapter) {
        this.adapter = adapter;
    }

    async write(path: string, contents: string): Promise<IMetadata> {
        path = this.cleanPath(path);

        await this.ensureDirectory(path);

        return this.adapter.write(path, contents);
    }

    async writeStream(path: string, stream: Stream): Promise<IMetadata> {
        path = this.cleanPath(path);

        await this.ensureDirectory(path);

        return this.adapter.writeStream(path, stream);
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

    listContents(directory: string = '', recursive: boolean = false): Promise<Array<IMetadata>> {
        return this.adapter.listContents(directory, recursive);
    }

    getMetadata(path: string): Promise<IMetadata> {
        path = this.cleanPath(path);
        return this.adapter.getMetadata(path);
    }

    getSize(path: string): Promise<number> {
        path = this.cleanPath(path);
        return this.adapter.getSize(path);
    }

    getMimetype(path: string): Promise<string> {
        path = this.cleanPath(path);
        return this.adapter.getMimetype(path);
    }

    getTimestamp(path: string): Promise<Date> {
        path = this.cleanPath(path);
        return this.adapter.getTimestamp(path);
    }

    getVisibility(path: string): Promise<string> {
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

    setVisibility(path: string, visibility: string): Promise<IMetadata> {
        path = this.cleanPath(path);
        return this.adapter.setVisibility(path, visibility);
    }


    async create(path: string, contents: string): Promise<IMetadata> {
        path = this.cleanPath(path);

        if (await this.exists(path)) {
            throw new Error('Cannot create a file that already exists. Use [create] or [update]');
        }

        await this.ensureDirectory(path);

        return this.adapter.write(path, contents);
    }

    async createStream(path: string, stream: Stream): Promise<IMetadata> {
        path = this.cleanPath(path);

        if (await this.exists(path)) {
            throw new Error('Cannot create a file that already exists. Use [create] or [update]');
        }

        await this.ensureDirectory(path);

        return this.adapter.writeStream(path, stream);
    }

    async update(path: string, contents: string): Promise<IMetadata> {
        path = this.cleanPath(path);

        if (!(await this.exists(path))) {
            throw new Error('Cannot update a file that does not exists. Use [create] or [write]');
        }

        await this.ensureDirectory(path);

        return this.adapter.write(path, contents);
    }

    async updateStream(path: string, stream: Stream): Promise<IMetadata> {
        path = this.cleanPath(path);

        if (!(await this.exists(path))) {
            throw new Error('Cannot update a file that does not exists. Use [create] or [write]');
        }

        await this.ensureDirectory(path);

        return this.adapter.writeStream(path, stream);
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
