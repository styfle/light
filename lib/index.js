"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route = require('./route'); // eslint-disable-line
module.exports = route.default;
exports = route.default;
var server_1 = require("./server");
exports.server = server_1.default;
var query_1 = require("./query");
exports.query = query_1.default;
var route_1 = require("./route");
exports.default = route_1.default;
exports.route = route_1.default;
exports.light = route_1.default;
var micro_1 = require("micro");
exports.buffer = micro_1.buffer;
exports.text = micro_1.text;
exports.json = micro_1.json;
exports.run = micro_1.run;
exports.send = micro_1.send;
exports.sendError = micro_1.sendError;
var micro_boom_1 = require("@ludicrousxyz/micro-boom");
exports.createError = micro_boom_1.createError;