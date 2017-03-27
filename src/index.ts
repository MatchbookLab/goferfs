import { dirname } from 'path';
import * as Stream from 'stream';

import { IFilesystem, IAdapter } from '../types';
import { Visibility, Metadata, File, StreamFile, ReadOptions, WriteOptions } from '../types';

const { version } = require('../package.json');

export class Gofer<TAdapter> implements IFilesystem<TAdapter> {
    targetVersion: string;
    adapterName: string;

    private adapter: IAdapter<TAdapter>;

    constructor(adapter: IAdapter<TAdapter>) {
        this.targetVersion = version;
        Gofer.versionCheck(adapter.targetVersion, this.targetVersion);

        this.adapter = adapter;
        this.adapterName = this.adapter.adapterName;
    }

    async write(path: string, contents: string | Buffer, { encoding = 'utf8', visibility = Visibility.Public }: WriteOptions = {}): Promise<Metadata> {
        path = Gofer.cleanPath(path);

        await this.ensureDirectory(path);

        return this.adapter.write(path, contents, { encoding, visibility });
    }

    async writeStream(path: string, stream: Stream, { encoding = 'utf8', visibility = Visibility.Public }: WriteOptions = {}): Promise<Metadata> {
        path = Gofer.cleanPath(path);

        await this.ensureDirectory(path);

        return this.adapter.writeStream(path, stream, { encoding, visibility });
    }

    exists(path: string): Promise<boolean> {
        path = Gofer.cleanPath(path);
        return this.adapter.exists(path);
    }

    read(path: string, { encoding = null }: ReadOptions = {}): Promise<File> {
        path = Gofer.cleanPath(path);
        return this.adapter.read(path, { encoding });
    }

    readStream(path: string, { encoding = null }: ReadOptions = {}): Promise<StreamFile> {
        path = Gofer.cleanPath(path);
        return this.adapter.readStream(path, { encoding });
    }

    getMetadata(path: string): Promise<Metadata> {
        path = Gofer.cleanPath(path);
        return this.adapter.getMetadata(path);
    }

    getVisibility(path: string): Promise<Visibility> {
        path = Gofer.cleanPath(path);
        return this.adapter.getVisibility(path);
    }

    move(oldPath: string, newPath: string): Promise<Metadata> {
        oldPath = Gofer.cleanPath(oldPath);
        newPath = Gofer.cleanPath(newPath);

        return this.adapter.move(oldPath, newPath);
    }

    copy(oldPath: string, clonedPath: string): Promise<Metadata> {
        oldPath = Gofer.cleanPath(oldPath);
        clonedPath = Gofer.cleanPath(clonedPath);

        return this.adapter.copy(oldPath, clonedPath);
    }

    async delete(path: string): Promise<boolean> {
        path = Gofer.cleanPath(path);

        if (!(await this.exists(path))) {
            // nothing was deleted as it doesn't exist
            return false;
        }

        return this.adapter.delete(path);
    }

    deleteDir(path: string): Promise<boolean> {
        path = Gofer.cleanPath(path);
        return this.adapter.deleteDir(path);
    }

    async createDir(path: string): Promise<Metadata> {
        path = Gofer.cleanPath(path);

        if (!(await this.exists(path))) {
            return this.adapter.createDir(path);
        }

        // already exists
        return null;
    }

    setVisibility(path: string, visibility: Visibility): Promise<Metadata> {
        path = Gofer.cleanPath(path);
        return this.adapter.setVisibility(path, visibility);
    }

    private ensureDirectory(path: string) {
        path = Gofer.cleanPath(path);
        const dir = dirname(path);
        return this.createDir(dir);
    }

    static cleanPath(path: string): string {
        return path.replace(/^\.?\/+/, '');
    }

    static versionCheck(targetVersion: string, currentVersion: string): void {
        // ensure it's a string (adapter may not use TypeScript)
        targetVersion += '';

        // first, make sure the target version is in the right format
        const matches = targetVersion.match(/^(\d+)\.(\d+)$/);
        if (!matches) {
            throw new Error(`Adapter's target version must be in the form for "<major>.<minor>"`);
        }

        const [, targetMajor, targetMinor] = matches;
        const [, major, minor] = currentVersion.match(/^(\d+)\.(\d+)\.\d+(?:-.+)?$/);

        const baseMsg = `The version of Gofer is "${currentVersion}", but the supplied adapter is targeting "${targetVersion}"`;

        if (major > targetMajor || major < targetMajor) {
            const extraMsg = major < targetMajor ? `version of "goferfs" to match` : `adapter to match, or contact the author if an appropriate update is not available`;
            throw new Error(`${baseMsg}. Incompatibility is likely to occur. Please upgrade your ${extraMsg}.`);
        }

        if (minor > targetMinor) {
            console.warn(`${baseMsg}. Some features may not be available, but everything that is should work fine.`);
        }

        if (minor < targetMinor) {
            console.warn(`${baseMsg}. The adapter may have some extra features that may not be available, but everything that is should work fine.`);
        }
    }
}
