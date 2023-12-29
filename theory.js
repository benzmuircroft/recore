// Function to scramble a 12-word seed with an alphanumeric PIN
const scramble = function scramble(seedWords, azAZ09Pin) {
  // Validate input
  if (!seedWords || seedWords.length !== 12 || !/^[a-zA-Z0-9]+$/.test(azAZ09Pin)) {
    throw new Error('Invalid input for scrambling.');
  }

  // Convert PIN to an array of numbers
  const pinArray = azAZ09Pin.split('').map(char => parseInt(char, 36));

  // Scramble seed words based on the PIN
  const scrambledSeedWords = seedWords
    .split(' ')
    .map((word, index) => {
      const pinIndex = index % pinArray.length;
      const newPosition = (index + pinArray[pinIndex]) % seedWords.length;
      return seedWords.split(' ')[newPosition];
    })
    .join(' ');

  return scrambledSeedWords;
};

// Function to unscramble data with an alphanumeric PIN
const unscramble = function unscramble(scrambledSeedWords, azAZ09Pin) {
  // Validate input
  if (!scrambledSeedWords || scrambledSeedWords.split(' ').length !== 12 || !/^[a-zA-Z0-9]+$/.test(azAZ09Pin)) {
    throw new Error('Invalid input for unscrambling.');
  }

  // Convert PIN to an array of numbers
  const pinArray = azAZ09Pin.split('').map(char => parseInt(char, 36));

  // Unscramble seed words based on the PIN
  const unscrambledSeedWords = scrambledSeedWords
    .split(' ')
    .map((word, index) => {
      const pinIndex = index % pinArray.length;
      const originalPosition = (index - pinArray[pinIndex] + scrambledSeedWords.length) % scrambledSeedWords.length;
      return scrambledSeedWords.split(' ')[originalPosition];
    })
    .join(' ');

  return unscrambledSeedWords;
};

// Example usage
const seedWords = 'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12';
const pin = 'abc12';

// Scramble the seed words
const scrambledData = scramble(seedWords, pin);
console.log('Scrambled Data:', scrambledData);

// Unscramble the data
const unscrambledSeedWords = unscramble(scrambledData, pin);
console.log('Unscrambled Seed Words:', unscrambledSeedWords);
