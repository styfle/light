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
const micro_1 = require("micro");
const aws_serverless_micro_1 = __importDefault(require("aws-serverless-micro"));
const pino_http_1 = __importDefault(require("pino-http"));
const micro_boom_1 = require("@ludicrousxyz/micro-boom");
exports.default = (route) => {
    console.log(1);
    const fn = (Req, Res) => {
        console.log(2);
        let exec = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(3);
            const middleware = route.middleware || [];
            console.log(4);
            if (fn.log !== false) {
                const pinoOptions = process.env.NODE_ENV === 'production' ? {} : {
                    prettyPrint: {
                        levelFirst: true,
                    },
                };
                const logger = pino_http_1.default(pinoOptions);
                middleware.unshift(logger);
                console.log(5);
            }
            console.log(6);
            for (const mw of middleware) { // eslint-disable-line
                yield mw(req, res); // eslint-disable-line
            }
            console.log(7);
            return route.handler(req, res);
        });
        console.log(8);
        if (route.plugins) {
            exec = route.plugins.reverse().reduce((acc, val) => val(acc), exec);
        }
        console.log(9);
        const isAWS = process.env.LIGHT_ENVIRONMENT === 'aws';
        if (isAWS) {
            console.log(11);
            return aws_serverless_micro_1.default(micro_boom_1.handleErrors(exec));
        }
        console.log(10);
        return micro_1.run(Req, Res, micro_boom_1.handleErrors(exec));
    };
    console.log(12);
    Object.keys(route).forEach((key) => {
        fn[key] = route[key];
    });
    fn.log = true;
    fn.module = __dirname;
    fn.handler = fn;
    console.log(13);
    return fn;
};
