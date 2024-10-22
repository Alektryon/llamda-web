// Define the type for a Cipher dataset
type CipherDataset = {
  title: string;
  values: number[];  // Array of 36 numbers
};

// Define the ciphers
const ciphers: CipherDataset[] = [
  {
    title: 'English Cabala',
    values: [...Array(10).keys(), ...Array.from({length: 26}, (_, i) => i + 1)]  // 0-9, a-z as 1-26
  },
  {
    title: 'AQ Cipher',
    values: [...Array(10).keys(), ...Array.from({length: 26}, (_, i) => i + 10)] // 0-9, a-z as 10-35
  },
  {
    title: 'Synx',
    values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 14, 15, 18, 20, 21, 28, 30, 35, 
             36, 42, 45, 63, 70, 84, 90, 105, 126, 140, 180, 210, 252, 315, 420, 630, 1260]
  },
  {
    title: 'Satanic Gematria',
    values: Array.from({length: 36}, (_, i) => {
      if (i < 10) return i * chaosFactor(i.toString());
      const char = String.fromCharCode(97 + i - 10);  // a-z
      return (i - 9) * chaosFactor(char);
    })
  }
];

const getCharValue = (char: string, cipher: CipherDataset): number | null => {
  const alphanumeric = '0123456789abcdefghijklmnopqrstuvwxyz';
  const index = alphanumeric.indexOf(char.toLowerCase());
  if (index < 0) return null;  // Return null for non-alphanumeric chars
  return cipher.values[index];
}

// Add this new function for the chaos factor
function chaosFactor(char: string): number {
  return char.charCodeAt(0) % 13;  // Using charCodeAt instead of hash
}

// Main function to compute the result for a given string
function computeGematria(input: string): any {
  return ciphers.map((cipher) => {
    let charValues = input.split('').map(char => ({
      char,
      value: getCharValue(char, cipher)
    }));

    let wordValues = input.split(/\s+/).filter(word => word.length > 0).map(word => {
      let wordValue = word.split('').reduce((sum, char) => {
        const val = getCharValue(char, cipher);
        return val !== null ? sum + val : sum;
      }, 0);
      return { word, value: wordValue };
    });

    let totalValue = charValues.reduce((sum, pair) => {
      return pair.value !== null ? sum + pair.value : sum;
    }, 0);

    return {
      cipher: cipher.title,
      charValues,
      wordValues,
      totalValue
    };
  });
}

// Example usage:
const inputString = "hello world!";
const result = computeGematria(inputString);
console.log(result);

export { computeGematria };

const englishOrdinal = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26
];

const aqCipher = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  30, 31, 32, 33, 34, 35
];

const createCipherObject = (values: number[]) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  return Object.fromEntries(chars.split('').map((char, index) => [char, values[index]]));
};

export const cyphers = {
  'English Ordinal': createCipherObject(englishOrdinal),
  'AQ Cipher': createCipherObject(aqCipher),
};

// For debugging
console.log('English Ordinal:', cyphers['English Ordinal']);
console.log('AQ Cipher:', cyphers['AQ Cipher']);

type GematriaSystem = {
  name: string;
  values: { [key: string]: number };
};

const alphanumeric = '0123456789abcdefghijklmnopqrstuvwxyz';

export const gematriaSystems: GematriaSystem[] = [
  {
    name: 'English Ordinal',
    values: Object.fromEntries(
      alphanumeric.split('').map((char, index) => [
        char,
        index < 10 ? index : index - 9 // 0-9 stay the same, a-z become 1-26
      ])
    )
  },
  {
    name: 'Full Reduction',
    values: Object.fromEntries(
      alphanumeric.split('').map((char, index) => [
        char,
        index < 10 ? index : ((index - 9) % 9) || 9 // 0-9 stay the same, a-z become 1-9 repeating
      ])
    )
  },
  {
    name: 'Reverse Ordinal',
    values: Object.fromEntries(
      alphanumeric.split('').map((char, index) => [
        char,
        index < 10 ? index : 26 - (index - 10) // 0-9 stay the same, a-z become 26-1
      ])
    )
  },
  // Add more gematria systems as needed
];

// For debugging
console.log('Gematria Systems:', gematriaSystems.map(sys => sys.name));
gematriaSystems.forEach(sys => console.log(`${sys.name}:`, sys.values));
