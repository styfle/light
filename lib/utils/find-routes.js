"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_isarray_1 = __importDefault(require("lodash.isarray"));
const path_1 = require("path");
const fs_1 = require("fs");
const glob_1 = __importDefault(require("./glob"));
exports.default = (routesPath) => {
    const routes = [];
    const addRoutes = (path) => {
        if (fs_1.lstatSync(path).isFile()) {
            return routes.push({
                path,
                name: path_1.basename(path),
            });
        }
        const files = glob_1.default(path_1.join('/', path), '**/*.{js,ts}');
        return routes.push(...files.map((r) => ({
            path: r,
            name: path_1.relative(path, r),
        })));
    };
    if (lodash_isarray_1.default(routesPath)) {
        routesPath.forEach((r) => addRoutes(r));
    }
    else {
        addRoutes(routesPath);
    }
    return routes;
};