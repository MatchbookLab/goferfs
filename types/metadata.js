"use strict";
var Metadata = (function () {
    function Metadata(paramaters) {
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
    return Metadata;
}());
exports.__esModule = true;
exports["default"] = Metadata;
