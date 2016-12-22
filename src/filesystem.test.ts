import * as chai from 'chai';

import Filesystem from './filesystem';
import { IAdapter } from './types';

chai.should();

export default function(adapter: IAdapter) {
    const fs = new Filesystem(adapter);

    describe('Write', () => {
        it('should write and read', async () => {
            await fs.put('test.txt', 'Hello, friend!');

            (await fs.has('test.txt')).should.equal(true);

            const { contents } = await fs.read('test.txt');
            contents.should.equal('Hello, friend!');
        });

        it('should delete', async () => {
            await fs.delete('test.txt');

            (await fs.has('test.txt')).should.equal(false);
        });
    });
}
