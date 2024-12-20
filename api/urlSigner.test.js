const { signatures } = require('./urlSigner');
const security = require('../security');
jest.mock('../security');

describe('urlSigner', () => {
  
  test('transforms list of course ids into signatures', () => {
    security.generateSignedUrl.mockImplementation(() => {
      return 'ASDF';
    });

    const courseIds = [1,2,3,4,5,6];
    const results = signatures(courseIds);
    expect(Object.keys(results)).toHaveLength(courseIds.length);
    courseIds.forEach((v) => {
      expect(results[v]).toBe('ASDF');
    });
  });
});

