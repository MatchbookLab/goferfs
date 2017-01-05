/// <reference types="fs-extra-promise" />

import * as Stream from 'stream';
import * as fs from 'fs-extra-promise';
import { resolve, basename, dirname, extname } from 'path';
import { lookup as mimeLookup } from 'mime';
import * as Bluebird from 'bluebird';

import { IMetadata, IFile, IStreamFile, IAdapter } from '../types';
import Metadata from '../metadata';
import File from '../file';
import StreamFile from '../stream-file';

export default class LocalAdapter implements IAdapter {
    private basePath: string;

    constructor(opts: { basePath: string }) {
        this.basePath = opts.basePath;
    }

    async create(path: string, contents: string): Promise<IMetadata> {
        path = this.fullPath(path);

        await fs.writeFileAsync(path, contents);

        return this.getMetadata(path);
    }

    async createStream(path: string, stream: Stream): Promise<IMetadata> {
        path = this.fullPath(path);

        stream.pipe(fs.createWriteStream(path));

        await new Bluebird((resolve, reject) => {
            stream.on('end', resolve);
            stream.on('error', reject);
        });

        return this.getMetadata(path);
    }

    async move(oldPath: string, newPath: string): Promise<IMetadata> {
        oldPath = this.fullPath(oldPath);
        newPath = this.fullPath(newPath);

        await fs.renameAsync(oldPath, newPath);

        return this.getMetadata(newPath);
    }

    async copy(oldPath: string, clonedPath: string): Promise<IMetadata> {
        oldPath = this.fullPath(oldPath);
        clonedPath = this.fullPath(clonedPath);

        await fs.copyAsync(oldPath, clonedPath);

        return this.getMetadata(clonedPath);
    }

    async delete(path: string): Promise<boolean> {
        path = this.fullPath(path);

        await fs.unlinkAsync(path);

        return true;
    }

    async deleteDir(path: string): Promise<boolean> {
        path = this.fullPath(path);

        await fs.removeAsync(path);

        return true;
    }

    async createDir(path: string): Promise<IMetadata> {
        path = this.fullPath(path);

        await fs.ensureDirAsync(path);

        return this.getMetadata(path);
    }

    async setVisibility(path: string, visibility: string): Promise<IMetadata> {
        path = this.fullPath(path);
        throw new Error('setVisibility NYI');
    }

    async exists(path: string): Promise<boolean> {
        path = this.fullPath(path);

        return fs.existsAsync(path);
    }

    async read(path: string): Promise<any> {
        path = this.fullPath(path);

        const contents = await fs.readFileAsync(path, 'utf8');

        return new File(await this.getMetadata(path), contents);
    }

    async readStream(path: string): Promise<IStreamFile> {
        path = this.fullPath(path);

        return new StreamFile(await this.getMetadata(path), fs.createReadStream(path, { encoding: 'utf8' }));
    }

    async listContents(directory: string = '', recursive: boolean = false): Promise<Array<IMetadata>> {
        directory = this.fullPath(directory);

        const paths = await fs.readdirAsync(directory);

        return Bluebird.map(paths, path => this.getMetadata(resolve(directory, path)));
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
            isDir: stats.isDirectory(),
            timestamp: stats.ctime,
            mimetype: mimeLookup(path),
        });
    }

    async getSize(path: string): Promise<number> {
        path = this.fullPath(path);

        const { size } = await fs.statAsync(path);

        return size;
    }

    async getMimetype(path: string): Promise<string> {
        return mimeLookup(path);
    }

    async getTimestamp(path: string): Promise<Date> {
        path = this.fullPath(path);

        const { ctime } = await fs.statAsync(path);

        return new Date(ctime);
    }

    async getVisibility(path: string): Promise<string> {
        path = this.fullPath(path);
        throw new Error('getVisibility NYI');
    }

    private fullPath(path: string): string {
        return resolve(this.basePath, path);
    }
}
