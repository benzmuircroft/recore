const Corestore = require('corestore');
const RAM = require('random-access-memory');
const b4a = require('b4a');

const recore = {
  createKeyPair: async function() {
    const s = new Corestore(RAM);
    await s.ready();
    const k = await s.createKeyPair(new Date().toString());
    await s.close();
    return {
      publicKey: k.publicKey.toString('hex'),
      secretKey: k.secretKey.toString('hex')
    };
  },
  createSeed: async function(keyPair) {
    const s = new Corestore(RAM);
    await s.ready();
    const i = s.get({
      keyPair: {
        publicKey: b4a.from(keyPair.publicKey, 'hex'),
        secretKey: b4a.from(keyPair.secretKey, 'hex')
      }
    });
    await i.ready();
    const seed = i.id;
    await i.close();
    await s.close();
    return seed;
  },
  reloadCore: async function(keyPair, seed, storeOptions, coreOptions) {
    let s;
    if (storeOptions._isCorestore) s = storeOptions;
    else s = new Corestore(storeOptions);
    await s.ready();
    const i = s.get({
      id: seed,
      keyPair: {
        publicKey: b4a.from(keyPair.publicKey, 'hex'),
        secretKey: b4a.from(keyPair.secretKey, 'hex')
      },
      ...coreOptions
    });
    await i.ready();
    return i;
  }
};

module.exports = recore;
