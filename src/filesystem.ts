import { dirname } from 'path';
import * as Stream from 'stream';

import { IMetadata, IFile, IStreamFile, IFilesystem, IReader, IWriter} from './types';

const typeSymbols = {
    reader: Symbol('IReader'),
    writer: Symbol('IWriter')
}

export default class Filesystem implements IFilesystem {
    private adapter: IReader|IWriter;

    constructor (adapter: IReader|IWriter) {
        this.adapter = adapter;
    }

    private checkType(type: Symbol) {
        let implementsInterface: boolean;

        switch(type) {
            case typeSymbols.reader:
                implementsInterface = ('read' in (this.adapter as IReader));
                break;
            case typeSymbols.writer:
                implementsInterface = ('write' in (this.adapter as IWriter));
                break;
        }

        if(!implementsInterface) {
            throw new Error(`Adapter must implement interface of type ${ type === typeSymbols.reader ? 'IReader' : 'IWriter' }`);
        }
    }

    async write(path: string, contents: string): Promise<IMetadata> {
        this.checkType(typeSymbols.writer);
        path = this.cleanPath(path);

        await this.ensureDirectory(path);

        return (this.adapter as IWriter).write(path, contents);
    }

    async writeStream(path: string, stream: Stream): Promise<IMetadata> {
        this.checkType(typeSymbols.writer);
        path = this.cleanPath(path);

        await this.ensureDirectory(path);

        return (this.adapter as IWriter).writeStream(path, stream);
    }

    exists(path: string): Promise<boolean> {
        path = this.cleanPath(path);
        return this.adapter.exists(path);
    }

    read(path: string): Promise<IFile> {
        this.checkType(typeSymbols.reader);
        path = this.cleanPath(path);
        return (this.adapter as IReader).read(path);
    }

    readStream(path: string): Promise<IStreamFile> {
        this.checkType(typeSymbols.reader);
        path = this.cleanPath(path);
        return (this.adapter as IReader).readStream(path);
    }

    listContents(directory: string = '', recursive: boolean = false): Promise<Array<IMetadata>> {
        this.checkType(typeSymbols.reader);
        return (this.adapter as IReader).listContents(directory, recursive);
    }

    getMetadata(path: string): Promise<IMetadata> {
        this.checkType(typeSymbols.reader);
        path = this.cleanPath(path);
        return (this.adapter as IReader).getMetadata(path);
    }

    getSize(path: string): Promise<number> {
        this.checkType(typeSymbols.reader);
        path = this.cleanPath(path);
        return (this.adapter as IReader).getSize(path);
    }

    getMimetype(path: string): Promise<string> {
        this.checkType(typeSymbols.reader);
        path = this.cleanPath(path);
        return (this.adapter as IReader).getMimetype(path);
    }

    getTimestamp(path: string): Promise<Date> {
        this.checkType(typeSymbols.reader);
        path = this.cleanPath(path);
        return (this.adapter as IReader).getTimestamp(path);
    }

    getVisibility(path: string): Promise<string> {
        this.checkType(typeSymbols.reader);
        path = this.cleanPath(path);
        return (this.adapter as IReader).getVisibility(path);
    }

    move(oldPath: string, newPath: string): Promise<IMetadata> {
        this.checkType(typeSymbols.writer);
        oldPath = this.cleanPath(oldPath);
        newPath = this.cleanPath(newPath);

        return (this.adapter as IWriter).move(oldPath, newPath);
    }

    copy(oldPath: string, clonedPath: string): Promise<IMetadata> {
        this.checkType(typeSymbols.writer);
        oldPath = this.cleanPath(oldPath);
        clonedPath = this.cleanPath(clonedPath);

        return (this.adapter as IWriter).copy(oldPath, clonedPath);
    }

    async delete(path: string): Promise<boolean> {
        this.checkType(typeSymbols.writer);
        path = this.cleanPath(path);

        if (!(await this.exists(path))) {
            // nothing was deleted as it doesn't exist
            return false;
        }

        return (this.adapter as IWriter).delete(path);
    }

    deleteDir(path: string): Promise<boolean> {
        this.checkType(typeSymbols.writer);
        path = this.cleanPath(path);
        return (this.adapter as IWriter).deleteDir(path);
    }

    async createDir(path: string): Promise<IMetadata> {
        this.checkType(typeSymbols.writer);
        path = this.cleanPath(path);

        if (!(await this.exists(path))) {
            return (this.adapter as IWriter).createDir(path);
        }

        // already exists
        return null;
    }

    setVisibility(path: string, visibility: string): Promise<IMetadata> {
        this.checkType(typeSymbols.reader);
        path = this.cleanPath(path);
        return (this.adapter as IWriter).setVisibility(path, visibility);
    }


    async create(path: string, contents: string): Promise<IMetadata> {
        this.checkType(typeSymbols.writer);
        path = this.cleanPath(path);

        if (await this.exists(path)) {
            throw new Error('Cannot create a file that already exists. Use [create] or [update]');
        }

        await this.ensureDirectory(path);

        return (this.adapter as IWriter).write(path, contents);
    }

    async createStream(path: string, stream: Stream): Promise<IMetadata> {
        this.checkType(typeSymbols.writer);
        path = this.cleanPath(path);

        if (await this.exists(path)) {
            throw new Error('Cannot create a file that already exists. Use [create] or [update]');
        }

        await this.ensureDirectory(path);

        return (this.adapter as IWriter).writeStream(path, stream);
    }

    async update(path: string, contents: string): Promise<IMetadata> {
        this.checkType(typeSymbols.writer);
        path = this.cleanPath(path);

        if (!(await this.exists(path))) {
            throw new Error('Cannot update a file that does not exists. Use [create] or [write]');
        }

        await this.ensureDirectory(path);

        return (this.adapter as IWriter).write(path, contents);
    }

    async updateStream(path: string, stream: Stream): Promise<IMetadata> {
        this.checkType(typeSymbols.writer);
        path = this.cleanPath(path);

        if (!(await this.exists(path))) {
            throw new Error('Cannot update a file that does not exists. Use [create] or [write]');
        }

        await this.ensureDirectory(path);

        return (this.adapter as IWriter).writeStream(path, stream);
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
