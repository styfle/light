import { run } from 'micro';
import { IncomingMessage, ServerResponse } from 'http';
import AWSServerlessMicro from 'aws-serverless-micro';
import pino from 'pino-http';
import { handleErrors } from '@ludicrousxyz/micro-boom';

interface Route {
  path?: string;
  middleware?: any[];
  plugins?: any[];
  handler: Handler;
}

// TODO: Define types for micro and aws
// TODO: Add test for POST/other methods
type Handler = any;
type IM = IncomingMessage;
type SR = ServerResponse;
type AP = Promise<any>;

export default (route: Route): Handler => {
  console.log(1)
  const fn = (Req: IM, Res: SR): AP => {
    console.log(2)
    try {
      let exec = async (req: IM, res: SR): AP => {
        console.log(3)
        const middleware: any[] = route.middleware || [];

        console.log(4)
        if (fn.log !== false) {
          const pinoOptions = process.env.NODE_ENV === 'production' ? {} : {
            prettyPrint: {
              levelFirst: true,
            },
          };
          const logger = pino(pinoOptions);
          middleware.unshift(logger);
          console.log(5);
        }

        console.log(6)
        for (const mw of middleware) { // eslint-disable-line
          await mw(req, res); // eslint-disable-line
        }
        console.log(7)

        return route.handler(req, res);
      };

      console.log(8)

      if (route.plugins) {
        exec = route.plugins.reverse().reduce((acc, val): any => val(acc), exec);
      }

      console.log(9)

      const isAWS: boolean = process.env.LIGHT_ENVIRONMENT === 'aws';
      if (isAWS) {
        console.log(11)
        return AWSServerlessMicro(handleErrors(exec));
      }
      console.log(10)
      return run(Req, Res, handleErrors(exec));
    } catch (err) {
      console.log('ERROR')
      console.log('------------------------------------')
      console.log(err);
      console.log('------------------------------------')
    }
    return (async (req: any, res: any): AP => { res.send('ok') })(Req, Res);
  };

  console.log(12)
  Object.keys(route).forEach((key): void => {
    (fn as any)[key] = (route as any)[key];
  });
  fn.log = true;
  fn.module = __dirname;
  fn.handler = fn;

  console.log(13)
  return fn;
};
