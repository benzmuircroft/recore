const crypto = require('hypercore-crypto');
const Corestore = require('corestore');

const recore = {
  createSeed: async function() {
    return crypto.randomBytes(16).toString('hex');
  },
  createKeyPair: async function(seed) {
    return crypto.keyPair(b4a.from(seed)); 
  },
  reloadCore: async function(keyPair, storeFolderOrRAM, coreOptions) {
    let s;
    if (storeFolderOrRAM._isCorestore) s = storeFolderOrRAM; // is a pre-created store
    else s = new Corestore(storeFolderOrRAM); // is a './folder' or RAM
    await s.ready();
    const i = s.get({
      keyPair,
      ...coreOptions
    });
    await i.ready();
    return i;
  }
};

module.exports = recore;
