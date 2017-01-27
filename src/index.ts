import { dirname } from 'path';
import * as Stream from 'stream';

import { IFilesystem, IAdapter } from './types/interfaces';
import { Visibility, Metadata, File, StreamFile } from './types';

const { version } = require('../package.json');

export default class Gofer implements IFilesystem {
    targetVersion: string;

    private adapter: IAdapter;

    constructor (adapter: IAdapter) {
        this.targetVersion = version;
        Gofer.versionCheck(adapter.targetVersion, this.targetVersion);

        this.adapter = adapter;
    }

    async write(path: string, contents: string, options?: { visibility?: Visibility }): Promise<Metadata> {
        path = this.cleanPath(path);

        await this.ensureDirectory(path);

        return this.adapter.write(path, contents, options);
    }

    async writeStream(path: string, stream: Stream, options?: { visibility?: Visibility }): Promise<Metadata> {
        path = this.cleanPath(path);

        await this.ensureDirectory(path);

        return this.adapter.writeStream(path, stream, options);
    }

    exists(path: string): Promise<boolean> {
        path = this.cleanPath(path);
        return this.adapter.exists(path);
    }

    read(path: string): Promise<File> {
        path = this.cleanPath(path);
        return this.adapter.read(path);
    }

    readStream(path: string): Promise<StreamFile> {
        path = this.cleanPath(path);
        return this.adapter.readStream(path);
    }

    getMetadata(path: string): Promise<Metadata> {
        path = this.cleanPath(path);
        return this.adapter.getMetadata(path);
    }

    getVisibility(path: string): Promise<Visibility> {
        path = this.cleanPath(path);
        return this.adapter.getVisibility(path);
    }

    move(oldPath: string, newPath: string): Promise<Metadata> {
        oldPath = this.cleanPath(oldPath);
        newPath = this.cleanPath(newPath);

        return this.adapter.move(oldPath, newPath);
    }

    copy(oldPath: string, clonedPath: string): Promise<Metadata> {
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

    async createDir(path: string): Promise<Metadata> {
        path = this.cleanPath(path);

        if (!(await this.exists(path))) {
            return this.adapter.createDir(path);
        }

        // already exists
        return null;
    }

    setVisibility(path: string, visibility: Visibility): Promise<Metadata> {
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
