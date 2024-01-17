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
