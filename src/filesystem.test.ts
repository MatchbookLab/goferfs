import * as chai from 'chai';

import Filesystem from './filesystem';
import { IAdapter } from './types';

chai.should();

export default function(adapter: IAdapter) {
    const fs = new Filesystem(adapter);

    describe('The Basics', function () {
        it('should write and read', async() => {
            await fs.put('test.txt', 'Hello, friend!');

            (await fs.has('test.txt')).should.equal(true);

            const { contents } = await fs.read('test.txt');
            contents.should.equal('Hello, friend!');
        });

        it('should delete', async() => {
            await fs.delete('test.txt');

            (await fs.has('test.txt')).should.equal(false);
        });

        it('should create path to file', async () => {
            await fs.put('path/to/test.txt', 'Test');

            (await fs.has('path/to/test.txt')).should.equal(true);
        });

        it('should delete a directory', async () => {
            await fs.deleteDir('path');

            (await fs.has('path/to/test.txt')).should.equal(false);
        });
    });

    describe('The Writing', function () {
        afterEach(async () => {
            await fs.deleteDir('/');

            (await fs.has('path')).should.equal(false);
        });

        it('should rename', async () => {
            await fs.put('path/to/test1.txt', 'Test');
            await fs.rename('path/to/test1.txt', 'path/to/test2.txt');

            (await fs.has('path/to/test1.txt')).should.equal(false);
            (await fs.has('path/to/test2.txt')).should.equal(true);
            (await fs.read('path/to/test1.txt')).contents.should.equal('Test');
        });

        it('should copy', async () => {
            await fs.put('path/to/test1.txt', 'Test');
            await fs.copy('path/to/test1.txt', 'path/to/test2.txt');

            (await fs.has('path/to/test1.txt')).should.equal(true);
            (await fs.has('path/to/test2.txt')).should.equal(true);
            (await fs.read('path/to/test1.txt')).contents.should.equal('Test');
            (await fs.read('path/to/test2.txt')).contents.should.equal('Test');
        });
    });
}
