import * as chai from 'chai';

import Filesystem from './filesystem';
import { IAdapter } from './types';
import { Readable } from 'stream';

chai.should();

export default function(adapter: IAdapter) {
    const filesystem = new Filesystem(adapter);

    describe('The Basics', function () {
        it('should write and read', async() => {
            await filesystem.write('test.txt', 'Hello, friend!');

            (await filesystem.exists('test.txt')).should.equal(true);

            const { contents } = await filesystem.read('test.txt');
            contents.should.equal('Hello, friend!');
        });

        it('should delete', async() => {
            await filesystem.delete('test.txt');

            (await filesystem.exists('test.txt')).should.equal(false);
        });

        it('should create path to file', async () => {
            await filesystem.write('path/to/test.txt', 'Test');

            (await filesystem.exists('path/to/test.txt')).should.equal(true);
        });

        it('should delete a directory', async () => {
            await filesystem.deleteDir('path');

            (await filesystem.exists('path/to/test.txt')).should.equal(false);
        });
    });

    describe('The Fun', function () {
        afterEach(async () => {
            await filesystem.deleteDir('/');

            (await filesystem.exists('path')).should.equal(false);
        });

        it('should rename', async () => {
            await filesystem.write('path/to/test1.txt', 'Test');
            await filesystem.move('path/to/test1.txt', 'path/to/test2.txt');

            (await filesystem.exists('path/to/test1.txt')).should.equal(false);
            (await filesystem.exists('path/to/test2.txt')).should.equal(true);
            (await filesystem.read('path/to/test2.txt')).contents.should.equal('Test');
        });

        it('should copy', async () => {
            await filesystem.write('path/to/test1.txt', 'Test');
            await filesystem.copy('path/to/test1.txt', 'path/to/test2.txt');

            (await filesystem.exists('path/to/test1.txt')).should.equal(true);
            (await filesystem.exists('path/to/test2.txt')).should.equal(true);
            (await filesystem.read('path/to/test1.txt')).contents.should.equal('Test');
            (await filesystem.read('path/to/test2.txt')).contents.should.equal('Test');
        });

        it('should get directory list', async () => {
            await filesystem.write('path/to/test1.txt', 'Test');
            await filesystem.copy('path/to/test1.txt', 'path/to/test2.txt');
            await filesystem.createDir('path/to/dir');

            const metadata = await filesystem.listContents('path/to');

            metadata.should.have.length(3);
        });

        it('should return full metadata', async () => {
            await filesystem.write('path/to/test1.txt', 'Test');
            const file = await filesystem.read('path/to/test1.txt');

            file.contents.should.equal('Test');
            file.name.should.equal('test1.txt');
            file.ext.should.equal('.txt');
            file.path.should.match(/path\/to\/test1\.txt$/);
            file.parentDir.should.match(/path\/to$/);
            file.size.should.equal(4);
            file.isFile.should.equal(true);
            file.isDir.should.equal(false);
            file.timestamp.should.be.a('Date');
            file.mimetype.should.equal('text/plain');
        });

        it('should do streams', async () => {
            const writeStream = new Readable();

            writeStream.push('Test Stream');
            writeStream.push(null);

            await filesystem.writeStream('path/to/test1.txt', writeStream);

            const { stream } = await filesystem.readStream('path/to/test1.txt');

            const contents = await new Promise((resolve, reject) => {
                let str = '';
                stream.on('data', (chunk: string) => str += chunk);
                stream.on('end', () => resolve(str));
                stream.on('error', reject);
            });

            contents.should.equal('Test Stream');
        });
    });
}
