import { resolve } from 'path';

import testSuite from '../suite.test';
import LocalAdapter from './local';

describe('Local Adapter', () => {
    const adapter = new LocalAdapter({
        rootPath: resolve(__dirname, '../../test-files'),
    });

    testSuite(adapter);
});
