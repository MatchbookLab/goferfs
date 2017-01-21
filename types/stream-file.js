"use strict";
var StreamFile = (function () {
    function StreamFile(metadata, stream) {
        this.stream = stream;
        this.name = metadata.name;
        this.ext = metadata.ext;
        this.path = metadata.path;
        this.parentDir = metadata.parentDir;
        this.visibility = metadata.visibility;
        this.size = metadata.size;
        this.isFile = metadata.isFile;
        this.isDir = metadata.isDir;
        this.timestamp = metadata.timestamp;
        this.mimetype = metadata.mimetype;
    }
    return StreamFile;
}());
exports.__esModule = true;
exports["default"] = StreamFile;
