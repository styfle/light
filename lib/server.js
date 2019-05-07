"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const micro_1 = __importDefault(require("micro"));
const micro_http_router_1 = __importDefault(require("@ludicrousxyz/micro-http-router"));
const find_routes_1 = __importDefault(require("./utils/find-routes"));
const import_route_1 = __importDefault(require("./utils/import-route"));
const light = ({ routes: routesPath, log = true, }) => {
    const router = new micro_http_router_1.default();
    const server = micro_1.default((req, res) => router.handle(req, res));
    const routes = find_routes_1.default(routesPath);
    routes.forEach((route) => {
        import_route_1.default(router, route, {
            log,
        });
    });
    return {
        router,
        server,
    };
};
exports.default = light;
