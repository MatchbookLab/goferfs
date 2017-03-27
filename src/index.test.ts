import test from 'ava';
import * as sinon from 'sinon';

import { Gofer } from './.';

test.beforeEach((t) => {
    t.context.warnStub = sinon.stub(console, 'warn');
});

test.afterEach.always((t) => {
    t.context.warnStub.restore();
});

test('version check should enforce "<major>.<minor>"', (t) => {
    t.throws(() => Gofer.versionCheck('1.2.3', '1.2.3'), `Adapter's target version must be in the form for "<major>.<minor>"`);
});

test('version check should throw an error if Adapter major version is newer', (t) => {
    t.throws(() => Gofer.versionCheck('2.2', '1.1.1'), /Please upgrade your version of "goferfs"/);
});

test('version check should throw an error if Adapter major version is older', (t) => {
    t.throws(() => Gofer.versionCheck('0.6', '1.2.3'), /Please upgrade your adapter to match/);
});

test('version check should only warn if target minor is too high', (t) => {
    Gofer.versionCheck('1.3', '1.2.3');
    t.true(t.context.warnStub.calledWithMatch('The adapter may have some extra features that may not be available'));
});

test('version check should only warn if target minor is too low', (t) => {
    Gofer.versionCheck('1.1', '1.2.3');
    t.true(t.context.warnStub.calledWithMatch('Some features may not be available'));
});

test('version check should do nothing if versions are compatible', (t) => {
    Gofer.versionCheck('1.0', '1.0.2');
    t.true(t.context.warnStub.notCalled);
});

test('version check should work with pre-release versions', (t) => {
    Gofer.versionCheck('1.0', '1.0.0-0.beta');
    t.true(t.context.warnStub.notCalled);
});

test('clean path cleans path', (t) => {
    t.deepEqual(Gofer.cleanPath('path/to/file.txt'), 'path/to/file.txt');
    t.deepEqual(Gofer.cleanPath('/path/to/file.txt'), 'path/to/file.txt');
    t.deepEqual(Gofer.cleanPath('./path/to/file.txt'), 'path/to/file.txt');
});

test('clean path handles root', (t) => {
    t.deepEqual(Gofer.cleanPath(''), '');
    t.deepEqual(Gofer.cleanPath('/'), '');
    t.deepEqual(Gofer.cleanPath('./'), '');
});
