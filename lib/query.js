"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const querystring_1 = require("querystring");
exports.default = (req) => {
    if (!req.url) {
        return {};
    }
    const { query } = url_1.parse(req.url);
    return querystring_1.parse(query || '');
};
