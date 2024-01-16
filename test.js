;(async function() {
  const Hyperswarm = require('hyperswarm');
  const Corestore = require('corestore');
  const Hyperbee = require('hyperbee');
  const b4a = require('b4a');
  const fs = require('fs').promises;


  process.on('error', function(e) {
    console.trace(e);
  });

  // recore
  const keyPair = {
    publicKey: 'a1d1f337d641a3fd06f40670ed559020ce046821cb7c9b22e3285f801090abdb',
    secretKey: 'e8ed0289107748c2d5a36ee83cc361b91fe6953300fa5e4c1c4920d8aa0399aea1d1f337d641a3fd06f40670ed559020ce046821cb7c9b22e3285f801090abdb'
  };
  const seed = {
    root: '9nfzc613j8a4pfqccp7xjmsywr81gsd54p43kabx73mjq7tsc9ro'
  };
  // end recore

  const ids = {
    root: 'w8e9gp6segt94bzwy3aq4icord8ye4bb3p6jsezdfbxayrroixpo'
  };
  //const publicKeys = {
  //  root: 'a1d1f337d641a3fd06f40670ed559020ce046821cb7c9b22e3285f801090abdb' // can be relied on !
  //};
  const discoveryKeys = {
    root: 'c9b7e2295c0dcabac61ec7169e114ef8adf508aca0ed49ee93fa40fc58fc5a45'
  };

  try {
    await fs.rm('./test/1', { recursive: true });
    await fs.rm('./test/2', { recursive: true });
  }
  catch (e) {}

  const s1 = new Corestore('./test/1');
  await s1.ready();
  
  const recore = require('./recore.js');

  const i1 = await recore.reloadCore(keyPair, seed.root, s1, { valueEncoding: 'json' });

  await i1.ready();

  console.log('core 1 id:          ', i1.id);
  console.log('core 1 key:         ', i1.key.toString('hex'));
  console.log('core 1 discoveryKey:', i1.discoveryKey.toString('hex'));
  console.log('core 1 writable:    ', i1.writable);
  console.log('core 1 publicKey:   ', i1.keyPair.publicKey.toString('hex'));


  const b1 = new Hyperbee(i1);
  await b1.ready();

  await b1.put('a', '2');

  let r1 = await b1.get('a');
  console.log(r1.key.toString(), r1.value.toString());


  const x1 = new Hyperswarm();
  x1.on('connection', (connection) => {
    console.log('swarm 1 connected to "remotePublicKey"', connection.remotePublicKey.toString('hex'));
    s1.replicate(connection);
  });
  x1.join(i1.discoveryKey, { server: true, client: true }); //x1.join(b4a.from(discoveryKeys.root, 'hex'), { server: true, client: true });
  await x1.flush();


  console.log('=====================================================================================');

  const s2 = new Corestore('./test/2');
  await s2.ready();
  
  const x2 = new Hyperswarm();
  x2.on('connection', (connection) => {
    console.log('swarm 2 connected to "remotePublicKey"', connection.remotePublicKey.toString('hex'));
    s2.replicate(connection);
  });
  x2.join(b4a.from(discoveryKeys.root, 'hex'), { server: false, client: true }); //x2.join(i1.discoveryKey, { server: false, client: true });
  await x2.flush();

  const i2 = s2.get({
    key: ids.root, valueEncoding: 'json' //key: i1.id, valueEncoding: 'json'
  });

  await i2.ready();
  
  await i2.update();

  if (i2.length === 0) {
    console.log('Could not connect to the writer peer');
  }

  console.log('core 2 id:          ', i2.id);
  console.log('core 2 key:         ', i2.key.toString('hex'));
  console.log('core 2 discoveryKey:', i2.discoveryKey.toString('hex'));
  console.log('core 2 writable:    ', i2.writable);
  console.log('core 2 publicKey:   ', undefined);

  const b2 = new Hyperbee(i2);
  await b2.ready();
  await b2.update({ wait: true });

  let r2 = await b2.get('a');
  console.log(r2.key.toString(), r2.value.toString());

  await b1.put('b', '3');

  console.log('done');


})();
