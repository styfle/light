"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const emojic_1 = __importDefault(require("emojic"));
const colorette_1 = require("colorette");
const index_1 = require("../../index");
const find_routes_1 = __importDefault(require("../../utils/find-routes"));
const import_route_1 = __importDefault(require("../../utils/import-route"));
const log_1 = __importDefault(require("../utils/log"));
const start = Date.now();
exports.command = 'dev [dir]';
exports.aliases = ['d'];
exports.desc = 'start a development srvr';
exports.builder = {
    log: {
        alias: 'l',
        description: 'enable or disable logs',
        boolean: true,
        default: true,
    },
    dir: {
        default: './',
        description: 'base directory for the light server',
        hidden: true,
    },
};
const handle = (argv) => __awaiter(this, void 0, void 0, function* () {
    log_1.default('start', `${emojic_1.default.fire} igniting the server ${emojic_1.default.fire}`, {
        titleColor: 'brightred',
        messageColor: 'brightred',
    });
    const cwd = path_1.join(process.cwd(), argv.dir);
    const routesPath = path_1.join(cwd, './routes');
    const app = index_1.server({
        routes: routesPath,
        log: argv.log,
    });
    const { PORT = 3000, HOST = '0.0.0.0', } = process.env;
    app.server.listen(PORT, HOST, () => {
        log_1.default(`${Date.now() - start}ms`, 'listening on 3000', {
            titleColor: 'green',
        });
        log_1.default('hmr', 'starting the hot reloader', {
            titleColor: 'brightblue',
        });
        const chokidar = require('chokidar'); // eslint-disable-line
        const watcher = chokidar.watch(cwd);
        watcher.on('ready', () => log_1.default('hmr', 'watching for changes', {
            titleColor: 'brightblue',
        }));
        watcher.on('change', (p) => {
            log_1.default('hmr', `swapping out ${colorette_1.yellow(path_1.relative(cwd, p))}`, {
                titleColor: 'brightblue',
            });
            delete require.cache[p];
            const routes = find_routes_1.default(routesPath);
            routes.forEach((route) => {
                delete require.cache[route.path];
                import_route_1.default(app.router, route, {
                    log: argv.log,
                });
            });
        });
    });
});
exports.handler = (argv) => {
    handle(argv).catch((err) => {
        log_1.default('error', err.toString(), {
            titleColor: 'red',
        });
    });
};
