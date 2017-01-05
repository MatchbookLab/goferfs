/// <reference types="fs-extra-promise" />

import * as Stream from 'stream';
import * as fs from 'fs-extra-promise';
import { resolve, basename, dirname, extname, relative } from 'path';
import { lookup as mimeLookup } from 'mime';
import * as Bluebird from 'bluebird';

import { IMetadata, IStreamFile, IAdapter } from '../types';
import Visibility from '../types/visibility';
import Metadata from '../metadata';
import File from '../file';
import StreamFile from '../stream-file';

export default class LocalAdapter implements IAdapter {
    private rootPath: string;
    private publicVisibilityMode: number;
    private privateVisibilityMode: number;

    constructor({
        rootPath,
        publicVisibilityMode = 0o644, // 100644 on Linux
        privateVisibilityMode = 0o600, // 100600 on Linux
    }: {
        rootPath: string,
        publicVisibilityMode?: number,
        privateVisibilityMode?: number,
    }) {
        this.rootPath = rootPath;
        this.publicVisibilityMode = publicVisibilityMode;
        this.privateVisibilityMode = privateVisibilityMode;
    }

    async write(path: string, contents: string, { visibility }: { visibility: Visibility } = { visibility: Visibility.Public }): Promise<IMetadata> {
        path = this.fullPath(path);

        // @TODO broken type here (mode isn't accepted)
        const writeFileAsync: any = fs.writeFileAsync;
        await writeFileAsync(path, contents, { mode: this.getMode(visibility) });

        return this.getMetadata(path);
    }

    async writeStream(path: string, stream: Stream, { visibility }: { visibility: Visibility } = { visibility: Visibility.Public }): Promise<IMetadata> {
        path = this.fullPath(path);

        stream.pipe(fs.createWriteStream(path, { mode: this.getMode(visibility) }));

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

    async setVisibility(path: string, visibility: Visibility): Promise<IMetadata> {
        path = this.fullPath(path);

        await fs.chmodAsync(path, this.getMode(visibility));

        return this.getMetadata(path);
    }

    async getVisibility(path: string): Promise<Visibility> {
        path = this.fullPath(path);

        return (await this.getMetadata(path)).visibility;
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

    async getMetadata(path: string): Promise<IMetadata> {
        path = this.fullPath(path);

        const stats = await fs.statAsync(path);

        return new Metadata({
            path: this.relativePath(path),
            name: basename(path),
            ext: extname(path),
            parentDir: this.relativePath(dirname(path)),
            size: stats.size,
            isFile: stats.isFile(),
            isDir: stats.isDirectory(),
            timestamp: stats.ctime,
            visibility: this.parseVisibility(stats.mode),
            mimetype: mimeLookup(path),
        });
    }

    private fullPath(path: string): string {
        return resolve(this.rootPath, path);
    }

    private relativePath(path: string): string {
        return relative(this.rootPath, path);
    }

    private getMode(visibility: Visibility) {
        if (visibility === Visibility.Private) {
            return this.privateVisibilityMode;
        }

        if (visibility === Visibility.Public) {
            return this.publicVisibilityMode;
        }

        throw new Error(`Unsupported Visibility: ${visibility}`);
    }

    private parseVisibility(mode: number) {
        // for now, we only support regular files
        // (this removes the regular file flag from the mode)
        // i.e. 0o100644 was passed in, and this returns 0o644
        mode = mode ^ fs.constants.S_IFREG;

        if (mode === this.publicVisibilityMode) {
            return Visibility.Public;
        }

        if (mode === this.privateVisibilityMode) {
            return Visibility.Private;
        }

        return null;
    }
}
