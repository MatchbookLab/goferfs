import test from 'ava';
import * as sinon from 'sinon';

import Gofer from './';

test.beforeEach((t) => {
    t.context.warnStub = sinon.stub(console, 'warn');
});

test.afterEach.always((t) => {
    t.context.warnStub.restore();
});

const { version } = require('./package.json');
const [, major, minor] = version.match(/^(\d+)\.(\d+)\.\d+$/);

test('version check should enforce "<major>.<minor>"', (t) => {
    t.throws(() => Gofer.versionCheck('1.2.3'), `Adapter's target version must be in the form for "<major>.<minor>"`);
});

test('version check should throw an error if Adapter major version is newer', (t) => {
    t.throws(() => Gofer.versionCheck(`${+major + 1}.2`), /Please upgrade your version of "goferfs"/);
});

test.skip('version check should throw an error if Adapter major version is older', (t) => {
    t.throws(() => Gofer.versionCheck(`${+major - 1}.2`), /Please upgrade your adapter to match/);
});

test('version check should only warn if target minor is too high', (t) => {
    Gofer.versionCheck(`${major}.${+minor + 1}`);
    t.true(t.context.warnStub.calledWithMatch('The adapter may have some extra features that may not be available'));
});

test('version check should only warn if target minor is too low', (t) => {
    Gofer.versionCheck(`${major}.${+minor - 1}`);
    t.true(t.context.warnStub.calledWithMatch('Some features may not be available'));
});
