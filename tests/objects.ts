import { join } from 'path';
import listen from 'test-listen';
import { resolve } from 'url';
import fetch from 'node-fetch';
import { server } from '../src/index';

const app = server({
  routes: join(__dirname, 'seeds/routes'),
  log: false,
});
let url: string;

beforeAll(async () => {
  url = await listen(app.server);
});

afterAll(() => app.server.close());

describe('routes', () => {
  describe('objects', () => {
    it('should work', async () => {
      expect.assertions(2);
      const req = await fetch(resolve(url, '/object'));
      const res = await req.json();
      expect(req.status).toStrictEqual(200);
      expect(res).toMatchObject({ hello: 'object world' });
    });

    it('should work in folders with a custom route', async () => {
      expect.assertions(2);
      const req = await fetch(resolve(url, '/api/v1/extra/object'));
      const res = await req.json();
      expect(req.status).toStrictEqual(200);
      expect(res).toMatchObject({ hello: 'extra object world' });
    });

    it('should work with default export', async () => {
      expect.assertions(2);
      const req = await fetch(resolve(url, '/default-object'));
      const res = await req.json();
      expect(req.status).toStrictEqual(200);
      expect(res).toMatchObject({ hello: 'default object world' });
      expect.assertions(2);
    });


    it('should work with missing url/path', async () => {
      expect.assertions(2);
      const req = await fetch(resolve(url, '/object-missing-url'));
      const res = await req.json();
      expect(req.status).toStrictEqual(200);
      expect(res).toMatchObject({ hello: 'missing url world' });
    });

    it('should work with missing url/path in a nested folder', async () => {
      expect.assertions(2);
      const req = await fetch(resolve(url, '/api/v1/object-missing-url'));
      const res = await req.json();
      expect(req.status).toStrictEqual(200);
      expect(res).toMatchObject({ hello: 'missing nested url world' });
    });
  });
});
