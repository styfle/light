process.env.LIGHT_ENVIRONMENT = 'runkit';
import * as runkit from './seeds/routes/runkit'; // eslint-disable-line

describe('runkit', () => {
  describe('handler', () => {
    it('should export endpoint', () => {
      expect.assertions(1);
      expect((runkit as any).endpoint).toBeTruthy();
    });
  });
});
