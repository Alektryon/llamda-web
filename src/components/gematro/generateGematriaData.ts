import { cyphers } from './cyphers';

export function generateGematriaData(input: string) {
  const data: { [key: string]: number } = {};

  for (const [cypherName, cypher] of Object.entries(cyphers)) {
    let sum = 0;
    for (const char of input.toLowerCase()) {
      const value = (cypher as {[key: string]: number})[char];
      if (typeof value === 'number' && !isNaN(value)) {
        sum += value;
      }
    }
    data[cypherName] = sum;
  }

  // Add English and Aiq Bekar summaries
  data['English Summary'] = calculateEnglishSummary(input);
  data['Aiq Bekar'] = calculateAiqBekar(data['English Ordinal']);

  return data;
}

function calculateEnglishSummary(input: string): number {
  let sum = 0;
  for (const char of input.toLowerCase()) {
    if (/[a-z]/.test(char)) {
      sum += char.charCodeAt(0) - 96;
    }
  }
  return sum;
}

function calculateAiqBekar(ordinalValue: number): number {
  if (typeof ordinalValue !== 'number' || isNaN(ordinalValue)) return 0;
  let sum = ordinalValue;
  while (sum > 9) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return sum;
}
