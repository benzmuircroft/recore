const crypto = require('crypto');

// Function to convert Ed25519 key pair to a 12-word seed
const keyPairTo12SeedWord = function keyPairTo12SeedWord(ed25519KeyPair) {
  // Replace this with your actual conversion logic
  // For simplicity, let's assume a direct concatenation
  return `${ed25519KeyPair.publicKey.toString('hex')}|${ed25519KeyPair.privateKey.toString('hex')}`;
};

// Function to scramble a 12-word seed with an alphanumeric PIN
const scramble = function scramble(seedWords, azAZ09Pin) {
  // Validate input
  if (!seedWords || !/^[a-fA-F0-9]+\|[a-fA-F0-9]+$/.test(seedWords) || !/^[a-zA-Z0-9]+$/.test(azAZ09Pin)) {
    throw new Error('Invalid input for scrambling.');
  }

  // Convert PIN to an array of numbers
  const pinArray = azAZ09Pin.split('').map(char => parseInt(char, 36));

  // Scramble seed words based on the PIN
  const scrambledSeedWords = seedWords
    .split('|')
    .map((word, index) => {
      const pinIndex = index % pinArray.length;
      const newPosition = (index + pinArray[pinIndex]) % seedWords.length;
      return seedWords.split('|')[newPosition];
    })
    .join('|');

  return scrambledSeedWords;
};

// Function to unscramble data with an alphanumeric PIN
const unscramble = function unscramble(scrambledSeedWords, azAZ09Pin) {
  // Validate input
  if (!scrambledSeedWords || !/^[a-fA-F0-9]+\|[a-fA-F0-9]+$/.test(scrambledSeedWords) || !/^[a-zA-Z0-9]+$/.test(azAZ09Pin)) {
    throw new Error('Invalid input for unscrambling.');
  }

  // Convert PIN to an array of numbers
  const pinArray = azAZ09Pin.split('').map(char => parseInt(char, 36));

  // Unscramble seed words based on the PIN
  const unscrambledSeedWords = scrambledSeedWords
    .split('|')
    .map((word, index) => {
      const pinIndex = index % pinArray.length;
      const originalPosition = (index - pinArray[pinIndex] + scrambledSeedWords.length) % scrambledSeedWords.length;
      return scrambledSeedWords.split('|')[originalPosition];
    })
    .join('|');

  return unscrambledSeedWords;
};

// Example usage
const ed25519KeyPair = crypto.signKeyPair();
const azAZ09Pin = '155Z0b';
const seedWords = keyPairTo12SeedWord(ed25519KeyPair);

// Scramble the seed words
const scrambledData = scramble(seedWords, azAZ09Pin);
console.log('Scrambled Data:', scrambledData);

// Unscramble the data
const unscrambledSeedWords = unscramble(scrambledData, azAZ09Pin);
console.log('Unscrambled Seed Words:', unscrambledSeedWords);
