## 🕳🥊 Recore 🧠

A method of remembering / recovering the same id, key & discoveryKey

## Installation
```
npm i "github:benzmuircroft/recore"
```

## Usage
```js
;(async function() {

  const recore = require('recore');

  // part 1

  const seed = await recore.createSeed();

  console.log('seed:', seed);
  
  const keyPair = await recore.createKeyPair(seed);

  console.log('keyPair:', keyPair);
  console.log({
    publicKey: b4a.from(keyPair.publicKey.toString('hex'), 'hex'),
    secretKey: b4a.from(keyPair.secretKey.toString('hex'), 'hex')
  });

  // comment out part 1, save what was printed out and retry like:
  /*
  const seed = '5bbj66y8njo79oarnbqxwf4x17up4yusg7h7zg7qcw6iey63rd7o';
  const keyPair = {
    publicKey: 'd8429f78071261dfc304105cfa174f9766dd02763779db9bae653d5403d920fb',
    secretKey: 'dc30c0a2f2fde06eea372240fbc50fcb83a64376750b37fc51dd99010c11d1e7d8429f78071261dfc304105cfa174f9766dd02763779db9bae653d5403d920fb'
  };
  */

  const core = await recore.reloadCore(keyPair, './folder', { valueEncoding: 'json' });
  
  console.log(`core:
    id:           ${core.id}
    key:          ${core.key.toString('hex')}
    discoveryKey: ${core.discoveryKey.toString('hex')}`
  );

  // over and over, every time it will get the same result!

})();
```




## Addendum:

```js
// recreates the same drive discovery key
const seed = 'edee2e749d94a2d275fa9e4edfdf84c8';
const readerKey = b4a.from('26eab3b63ef34a2325865054a5423679035a85e7aca26a7cf8c4286f61ca29b8', 'hex'); // from drive.key.toString('hex'))
const primaryKeyHex = b4a.alloc(32).fill(seed); // the writers corestore
const topic = crypto.discoveryKey(readerKey); // from drive.key.toString('hex') not needed!!!!!
/*
the discoveryKey is useful with hyperdrive v11.6.3 but you could also just join a b4a.alloc('32', 'string') as the topic

the whole point of this exercise is that we prove that we can recore even drives from seeds determinalistically everytime even if you delete the storage
you can get it back from scratch!!
*/
```
