"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const path_1 = require("path");
const { version } = require('../package.json');
class Gofer {
    constructor(adapter) {
        this.targetVersion = version;
        Gofer.versionCheck(adapter.targetVersion, this.targetVersion);
        this.adapter = adapter;
    }
    write(path, contents, options) {
        return __awaiter(this, void 0, void 0, function* () {
            path = this.cleanPath(path);
            yield this.ensureDirectory(path);
            return this.adapter.write(path, contents, options);
        });
    }
    writeStream(path, stream, options) {
        return __awaiter(this, void 0, void 0, function* () {
            path = this.cleanPath(path);
            yield this.ensureDirectory(path);
            return this.adapter.writeStream(path, stream, options);
        });
    }
    exists(path) {
        path = this.cleanPath(path);
        return this.adapter.exists(path);
    }
    read(path) {
        path = this.cleanPath(path);
        return this.adapter.read(path);
    }
    readStream(path) {
        path = this.cleanPath(path);
        return this.adapter.readStream(path);
    }
    getMetadata(path) {
        path = this.cleanPath(path);
        return this.adapter.getMetadata(path);
    }
    getVisibility(path) {
        path = this.cleanPath(path);
        return this.adapter.getVisibility(path);
    }
    move(oldPath, newPath) {
        oldPath = this.cleanPath(oldPath);
        newPath = this.cleanPath(newPath);
        return this.adapter.move(oldPath, newPath);
    }
    copy(oldPath, clonedPath) {
        oldPath = this.cleanPath(oldPath);
        clonedPath = this.cleanPath(clonedPath);
        return this.adapter.copy(oldPath, clonedPath);
    }
    delete(path) {
        return __awaiter(this, void 0, void 0, function* () {
            path = this.cleanPath(path);
            if (!(yield this.exists(path))) {
                return false;
            }
            return this.adapter.delete(path);
        });
    }
    deleteDir(path) {
        path = this.cleanPath(path);
        return this.adapter.deleteDir(path);
    }
    createDir(path) {
        return __awaiter(this, void 0, void 0, function* () {
            path = this.cleanPath(path);
            if (!(yield this.exists(path))) {
                return this.adapter.createDir(path);
            }
            return null;
        });
    }
    setVisibility(path, visibility) {
        path = this.cleanPath(path);
        return this.adapter.setVisibility(path, visibility);
    }
    ensureDirectory(path) {
        path = this.cleanPath(path);
        const dir = path_1.dirname(path);
        return this.createDir(dir);
    }
    cleanPath(path) {
        return path.replace(/^\.?\/+/, '');
    }
    static versionCheck(targetVersion, currentVersion) {
        targetVersion += '';
        const matches = targetVersion.match(/^(\d+)\.(\d+)$/);
        if (!matches) {
            throw new Error(`Adapter's target version must be in the form for "<major>.<minor>"`);
        }
        const [, targetMajor, targetMinor] = matches;
        const [, major, minor] = currentVersion.match(/^(\d+)\.(\d+)\.\d+(?:-.+)?$/);
        const baseMsg = `The version of Gofer is "${currentVersion}", but the supplied adapter is targeting "${targetVersion}"`;
        if (major > targetMajor || major < targetMajor) {
            const extraMsg = major < targetMajor ? `version of "goferfs" to match` : `adapter to match, or contact the author if an appropriate update is not available`;
            throw new Error(`${baseMsg}. Incompatibility is likely to occur. Please upgrade your ${extraMsg}.`);
        }
        if (minor > targetMinor) {
            console.warn(`${baseMsg}. Some features may not be available, but everything that is should work fine.`);
        }
        if (minor < targetMinor) {
            console.warn(`${baseMsg}. The adapter may have some extra features that may not be available, but everything that is should work fine.`);
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Gofer;
