import { basename, resolve, dirname } from 'path';
import * as Stream from 'stream';

import { IMetadata, IFile, IStreamFile, IFilesystem, IAdapter } from './types';

export default class Filesystem implements IFilesystem {
    private adapter: IAdapter;

    constructor (adapter: IAdapter) {
        this.adapter = adapter;
    }


    async put(path: string, contents: string): Promise<IMetadata> {
        path = this.cleanPath(path);
        await this.ensureDirectory(path);

        if (await this.has(path)) {
            return this.update(path, contents);
        }

        return this.write(path, contents);
    }

    async putStream(path: string, stream: Stream): Promise<IMetadata> {
        path = this.cleanPath(path);
        if (await this.has(path)) {
            return this.updateStream(path, stream);
        }

        return this.writeStream(path, stream);
    }



    has(path: string): Promise<boolean> {
        path = this.cleanPath(path);
        return this.adapter.has(path);
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



    async write(path: string, contents: string): Promise<IMetadata> {
        path = this.cleanPath(path);

        if (await this.has(path)) {
            throw new Error('Cannot write to a file that already exists. Use [put] or [update]');
        }

        await this.ensureDirectory(path);

        return this.adapter.write(path, contents);
    }

    async writeStream(path: string, stream: Stream): Promise<IMetadata> {
        path = this.cleanPath(path);
        await this.ensureDirectory(path);
        return this.adapter.writeStream(path, stream);
    }

    async update(path: string, contents: string): Promise<IMetadata> {
        path = this.cleanPath(path);

        if (!(await this.has(path))) {
            throw new Error('Cannot update a file that does not exists. Use [put] or [write]');
        }

        await this.ensureDirectory(path);

        return this.adapter.write(path, contents);
    }

    async updateStream(path: string, stream: Stream): Promise<IMetadata> {
        path = this.cleanPath(path);
        await this.ensureDirectory(path);
        return this.adapter.writeStream(path, stream);
    }

    rename(oldPath: string, newPath: string): Promise<IMetadata> {
        oldPath = this.cleanPath(oldPath);
        newPath = this.cleanPath(newPath);

        return this.adapter.rename(oldPath, newPath);
    }

    copy(oldPath: string, clonedPath: string): Promise<IMetadata> {
        oldPath = this.cleanPath(oldPath);
        clonedPath = this.cleanPath(clonedPath);

        return this.adapter.copy(oldPath, clonedPath);
    }

    async delete(path: string): Promise<boolean> {
        path = this.cleanPath(path);

        if (!(await this.has(path))) {
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

        if (!(await this.has(path))) {
            return this.adapter.createDir(path);
        }

        // already exists
        return null;
    }

    setVisibility(path: string, visibility: string): Promise<IMetadata> {
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
