import { Writable } from 'stream';
import * as nodeFs from 'fs';
import { resolve, basename, dirname, extname } from 'path';
import * as mkdirpSync from 'mkdirp';

import * as Bluebird from 'bluebird';

import { IMetadata, IFile, IStreamFile, IAdapter } from '../types';
import Metadata from '../metadata';

const mkdirp = Bluebird.promisify(mkdirpSync);
const fs: any = Bluebird.promisifyAll(nodeFs);

export default class LocalAdapter implements IAdapter {
    private basePath: string;

    constructor(opts: { basePath: string }) {
        this.basePath = opts.basePath;
    }

    async write(path: string, contents: string): Promise<IMetadata> {
        path = this.fullPath(path);

        await fs.writeFileAsync(path, contents);

        return this.getMetadata(path);
    }

    async writeStream(path: string, stream: Writable): Promise<IMetadata> {
        path = this.fullPath(path);
        throw new Error('writeStream NYI');
    }

    async update(path: string, contents: string): Promise<IMetadata> {
        path = this.fullPath(path);
        throw new Error('update NYI');
    }

    async updateStream(path: string, stream: Writable): Promise<IMetadata> {
        path = this.fullPath(path);
        throw new Error('updateStream NYI');
    }

    async rename(oldPath: string, newPath: string): Promise<IMetadata> {
        throw new Error('rename NYI');
    }

    async copy(oldPath: string, clonedPath: string): Promise<IMetadata> {
        throw new Error('copy NYI');
    }

    async delete(path: string): Promise<boolean> {
        path = this.fullPath(path);

        await fs.unlinkAsync(path);

        return true;
    }

    async deleteDir(path: string): Promise<boolean> {
        path = this.fullPath(path);
        throw new Error('deleteDir NYI');
    }

    async createDir(path: string): Promise<IMetadata> {
        path = this.fullPath(path);

        await mkdirp(path);

        return this.getMetadata(path);
    }

    async setVisibility(path: string, visibility: string): Promise<boolean> {
        path = this.fullPath(path);
        throw new Error('setVisibility NYI');
    }

    async has(path: string): Promise<boolean> {
        path = this.fullPath(path);
        // the async version of exists is deprecated...
        return Promise.resolve(fs.existsSync(path));
    }

    async read(path: string): Promise<any> {
        path = this.fullPath(path);

        return { contents: await fs.readFileAsync(path, { encoding: 'utf8' }) };
    }

    async readStream(path: string): Promise<IStreamFile> {
        path = this.fullPath(path);
        throw new Error('readStream NYI');
    }

    async listContents(directory: string, recursive: boolean): Promise<Array<IMetadata>> {
        throw new Error('listContents NYI');
    }

    async getMetadata(path: string): Promise<IMetadata> {
        path = this.fullPath(path);

        const stats = await fs.statAsync(path);

        return new Metadata({
            path,
            name: basename(path),
            ext: extname(path),
            parentDir: dirname(path),
            size: stats.size,
            isFile: stats.isFile(),
            isDir: stats.isDir(),
            timestamp: stats.ctime,
            mimetype: stats.mimetype,
        });
    }

    async getSize(path: string): Promise<number> {
        path = this.fullPath(path);
        throw new Error('getSize NYI');
    }

    async getMimetype(path: string): Promise<string> {
        path = this.fullPath(path);
        throw new Error('getMimetype NYI');
    }

    async getTimestamp(path: string): Promise<Date> {
        path = this.fullPath(path);
        throw new Error('getTimestamp NYI');
    }

    async getVisibility(path: string): Promise<string> {
        path = this.fullPath(path);
        throw new Error('getVisibility NYI');
    }

    private fullPath(path: string): string {
        return resolve(this.basePath, path);
    }
}
