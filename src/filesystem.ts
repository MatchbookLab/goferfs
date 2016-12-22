import { basename, resolve, dirname } from 'path';
import { Writable } from 'stream';

import { IMetadata, IFile, IStreamFile, IAdapter } from './types';

export default class Filesystem implements IAdapter {
    private adapter: IAdapter;

    constructor (adapter: IAdapter) {
        this.adapter = adapter;
    }


    async put(path: string, contents: string): Promise<IMetadata> {
        path = this.cleanPath(path);
        if (await this.has(path)) {
            return this.update(path, contents);
        }

        return this.write(path, contents);
    }

    async putStream(path: string, stream: Writable): Promise<IMetadata> {
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
        await this.ensureDirectory(path);
        return this.adapter.write(path, contents);
    }

    async writeStream(path: string, stream: Writable): Promise<IMetadata> {
        path = this.cleanPath(path);
        await this.ensureDirectory(path);
        return this.adapter.writeStream(path, stream);
    }

    async update(path: string, contents: string): Promise<IMetadata> {
        path = this.cleanPath(path);
        await this.ensureDirectory(path);
        return this.adapter.update(path, contents);
    }

    async updateStream(path: string, stream: Writable): Promise<IMetadata> {
        path = this.cleanPath(path);
        await this.ensureDirectory(path);
        return this.adapter.updateStream(path, stream);
    }

    rename(oldPath: string, newPath: string): Promise<boolean> {
        return this.adapter.rename(oldPath, newPath);
    }

    copy(oldPath: string, clonedPath: string): Promise<boolean> {
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

    async createDir(path: string): Promise<boolean> {
        path = this.cleanPath(path);

        if (!(await this.has(path))) {
            return this.adapter.createDir(path);
        }

        // already exists
        return false;
    }

    setVisibility(path: string, visibility: string): Promise<boolean> {
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
