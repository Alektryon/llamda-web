"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeGematria = computeGematria;
// Define the ciphers
var ciphers = [
    {
        title: 'English Cabala',
        values: __spreadArray(__spreadArray([], Array(10).keys(), true), Array.from({ length: 26 }, function (_, i) { return i + 1; }), true) // 0-9, a-z as 1-26
    },
    {
        title: 'AQ Cipher',
        values: __spreadArray(__spreadArray([], Array(10).keys(), true), Array.from({ length: 26 }, function (_, i) { return i + 10; }), true) // 0-9, a-z as 10-35
    },
    {
        title: 'Synx',
        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 14, 15, 18, 20, 21, 28, 30, 35,
            36, 42, 45, 63, 70, 84, 90, 105, 126, 140, 180, 210, 252, 315, 420, 630, 1260]
    },
    {
        title: 'Satanic Gematria',
        values: Array.from({ length: 36 }, function (_, i) {
            if (i < 10)
                return i * chaosFactor(i.toString());
            var char = String.fromCharCode(97 + i - 10); // a-z
            return (i - 9) * chaosFactor(char);
        })
    }
];
var getCharValue = function (char, cipher) {
    var alphanumeric = '0123456789abcdefghijklmnopqrstuvwxyz';
    var index = alphanumeric.indexOf(char.toLowerCase());
    if (index < 0)
        return null; // Return null for non-alphanumeric chars
    if (cipher.title === 'Satanic Gematria') {
        var numericValue = index < 10 ? index : index - 9;
        return numericValue * chaosFactor(char.toLowerCase());
    }
    return cipher.values[index];
};
// Add this new function for the chaos factor
function chaosFactor(char) {
    return char.charCodeAt(0) % 13; // Using charCodeAt instead of hash
}
// Main function to compute the result for a given string
function computeGematria(input) {
    return ciphers.map(function (cipher) {
        var charValues = input.split('').map(function (char) { return ({
            char: char,
            value: getCharValue(char, cipher)
        }); });
        var wordValues = input.split(/(\s+)/).map(function (word) {
            var wordValue = word.split('').reduce(function (sum, char) {
                var val = getCharValue(char, cipher);
                return val ? sum + val : sum;
            }, 0);
            return { word: word, value: wordValue };
        });
        var totalValue = charValues.reduce(function (sum, pair) {
            return pair.value !== null ? sum + pair.value : sum;
        }, 0);
        return {
            cipher: cipher.title,
            charValues: charValues,
            wordValues: wordValues,
            totalValue: totalValue
        };
    });
}
// Example usage:
var inputString = "hello world!";
var result = computeGematria(inputString);
console.log(result);
