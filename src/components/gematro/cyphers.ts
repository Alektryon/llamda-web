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

export const cyphers = {
  'English Ordinal': {
    'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
    'j': 10, 'k': 11, 'l': 12, 'm': 13, 'n': 14, 'o': 15, 'p': 16, 'q': 17,
    'r': 18, 's': 19, 't': 20, 'u': 21, 'v': 22, 'w': 23, 'x': 24, 'y': 25, 'z': 26
  },
  // Add other cyphers here...
};
