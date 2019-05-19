import { CommandBuilder } from 'yargs'; // eslint-disable-line
import { join, relative } from 'path';
import emojic from 'emojic';
import chalk from 'chalk';
import logger from '../../utils/logger';

import Route from '../../types/route';
import { server } from '../../index';
import findRoutes from '../../utils/find-routes';
import importRoute from '../../utils/import-route';

export const command = 'dev [dir]';
export const aliases: string[] = ['d'];
export const desc = 'start a development srvr';

export const builder: CommandBuilder = {
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

interface Args {
  log: boolean;
  dir: string;
}

const handle = async (argv: Args): Promise<void> => {
  logger.start(`${emojic.fire} igniting the server ${emojic.fire}`);

  const cwd = join(process.cwd(), argv.dir);
  const routesPath = join(cwd, './routes');

  const app = server({
    routes: routesPath,
    log: argv.log,
  });

  interface ProcessEnv {
    [key: string]: string | number | undefined;
  }

  const {
    PORT = 3000,
    HOST = '0.0.0.0',
  }: ProcessEnv = process.env;

  app.server.listen(PORT, (HOST as any), (): void => {
    logger.listening('on port 3000');

    logger.hmr('starting the hot reloader');
    const chokidar = require('chokidar'); // eslint-disable-line
    const watcher = chokidar.watch(cwd);
    watcher.on('ready', (): void => logger.hmr('watching for changes'));
    watcher.on('change', (p: string): void => {
      logger.hmr(`swapping out ${chalk.yellow(relative(cwd, p))}`);
      delete require.cache[p];
      const routes = findRoutes(routesPath);
      routes.forEach((route: Route): void => {
        delete require.cache[route.path];
        importRoute(app.router, route, {
          log: argv.log,
        });
      });
    });
  });
};

export const handler = (argv: Args): void => {
  handle(argv).catch((err: Error): void => {
    logger.fatal(err);
    process.exit(1);
  });
};
