"use strict";
const ava_1 = require("ava");
const sinon = require("sinon");
const _1 = require("./.");
ava_1.default.beforeEach((t) => {
    t.context.warnStub = sinon.stub(console, 'warn');
});
ava_1.default.afterEach.always((t) => {
    t.context.warnStub.restore();
});
ava_1.default('version check should enforce "<major>.<minor>"', (t) => {
    t.throws(() => _1.default.versionCheck('1.2.3', '1.2.3'), `Adapter's target version must be in the form for "<major>.<minor>"`);
});
ava_1.default('version check should throw an error if Adapter major version is newer', (t) => {
    t.throws(() => _1.default.versionCheck('2.2', '1.1.1'), /Please upgrade your version of "goferfs"/);
});
ava_1.default('version check should throw an error if Adapter major version is older', (t) => {
    t.throws(() => _1.default.versionCheck('0.6', '1.2.3'), /Please upgrade your adapter to match/);
});
ava_1.default('version check should only warn if target minor is too high', (t) => {
    _1.default.versionCheck('1.3', '1.2.3');
    t.true(t.context.warnStub.calledWithMatch('The adapter may have some extra features that may not be available'));
});
ava_1.default('version check should only warn if target minor is too low', (t) => {
    _1.default.versionCheck('1.1', '1.2.3');
    t.true(t.context.warnStub.calledWithMatch('Some features may not be available'));
});
ava_1.default('version check should do nothing if versions are compatible', (t) => {
    _1.default.versionCheck('1.0', '1.0.2');
    t.true(t.context.warnStub.notCalled);
});
ava_1.default('version check should work with pre-release versions', (t) => {
    _1.default.versionCheck('1.0', '1.0.0-0.beta');
    t.true(t.context.warnStub.notCalled);
});
