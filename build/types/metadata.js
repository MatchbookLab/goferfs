"use strict";
class Metadata {
    constructor(paramaters) {
        this.name = paramaters.name;
        this.ext = paramaters.ext;
        this.path = paramaters.path;
        this.parentDir = paramaters.parentDir;
        this.visibility = paramaters.visibility;
        this.size = paramaters.size;
        this.isFile = paramaters.isFile;
        this.isDir = paramaters.isDir;
        this.timestamp = paramaters.timestamp;
        this.mimetype = paramaters.mimetype;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Metadata;
