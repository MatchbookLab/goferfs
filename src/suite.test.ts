import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import Filesystem from './filesystem';
import { IReader, IWriter } from './types';
import { Readable } from 'stream';

chai.use(chaiAsPromised);
chai.should();

export default function(adapter: IReader|IWriter) {
    const filesystem = new Filesystem(adapter);

    const isReader = 'read' in (adapter as IReader);
    const isWriter = 'write' in (adapter as IWriter);

    describe('Adapter tests', function() {
        if(!(isReader && isWriter)) {
            console.log('Test suite only supports adapters that implement IReader and IWriter');
            return;
        }

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

            it('should throw if you try to create a file that exists', async () => {
                await filesystem.write('path/to/test.txt', 'Test');

                return filesystem.create('path/to/test.txt', 'Test').should.eventually.be.rejectedWith('Cannot create a file that already exists. Use [create] or [update]');
            });

            it('should throw if you try to update a file that does not exists', async () => {
                await filesystem.update('path/to/test.txt', 'Test Again');

                const { contents } = await filesystem.read('path/to/test.txt');
                contents.should.equal('Test Again');

                return filesystem.update('path/to/does-not-exist.txt', 'Test').should.eventually.be.rejectedWith('Cannot update a file that does not exists. Use [create] or [write]');
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
                file.path.should.equal('path/to/test1.txt');
                file.parentDir.should.equal('path/to');
                file.size.should.equal(4);
                file.isFile.should.equal(true);
                file.isDir.should.equal(false);
                file.timestamp.should.be.a('Date');
                file.mimetype.should.equal('text/plain');
            });

            it('should do streams', async () => {
                const inputStream = new Readable();

                inputStream.push('Test Stream');
                inputStream.push(null);

                await filesystem.writeStream('path/to/test1.txt', inputStream);

                const { stream } = await filesystem.readStream('path/to/test1.txt');

                const contents = await new Promise((resolve, reject) => {
                    let str = '';
                    stream.on('data', (chunk: string) => str += chunk);
                    stream.on('end', () => resolve(str));
                    stream.on('error', reject);
                });

                contents.should.equal('Test Stream');
            });

            it('should throw if you try to createStream a file that exists', async () => {
                await filesystem.write('path/to/test.txt', 'Test');

                return filesystem.createStream('path/to/test.txt', new Readable()).should.eventually.be.rejectedWith('Cannot create a file that already exists. Use [create] or [update]');
            });

            it('should throw if you try to updateStream a file that does not exists', async () => {
                await filesystem.write('path/to/test.txt', 'Test');

                const inputStream = new Readable();

                inputStream.push('Test Again');
                inputStream.push(null);

                await filesystem.updateStream('path/to/test.txt', inputStream);

                const { contents } = await filesystem.read('path/to/test.txt');
                contents.should.equal('Test Again');

                return filesystem.updateStream('path/to/does-not-exist.txt', new Readable()).should.eventually.be.rejectedWith('Cannot update a file that does not exists. Use [create] or [write]');
            });
        });

    });
}
