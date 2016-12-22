import { resolve } from 'path';

import testSuite from '../filesystem.test';
import LocalAdapter from './local';

describe('Local Adapter', () => {
    const adapter = new LocalAdapter({
        basePath: resolve(__dirname, '../../test-files'),
    });

    testSuite(adapter);
});
