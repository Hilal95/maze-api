const Key = require('../key-model');

describe('Key Model', () => {
  it('valid key model', () => {
    const data = {
      active: true,
      created: new Date('10/12/14')
    };

    const key = new Key();
    expect(key.toJSON()).toMatchInlineSnapshot(
      {
        _id: expect.any(Object),
        created: expect.any(Date)
      },
      `
      Object {
        "_id": Any<Object>,
        "active": true,
        "created": Any<Date>,
      }
    `);
  });
});
