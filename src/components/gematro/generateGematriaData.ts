import { gematriaSystems } from './cyphers';

export function generateGematriaData(input: string) {
  const data: { [key: string]: number } = {};

  for (const system of gematriaSystems) {
    let sum = 0;
    for (const char of input.toLowerCase()) {
      const value = system.values[char];
      if (typeof value === 'number') {
        sum += value;
      }
    }
    data[system.name] = sum;
  }

  return data;
}
