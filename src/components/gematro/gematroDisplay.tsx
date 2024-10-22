import React, { useState, useEffect } from 'react';
import { generateGematriaData } from './generateGematriaData';
import { gematriaSystems } from './cyphers';

const GematroDisplay: React.FC = () => {
  const [input, setInput] = useState('');
  const [gematriaData, setGematriaData] = useState<{ [key: string]: number }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setInput(newInput);
    setGematriaData(generateGematriaData(newInput));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-300 p-4">
      <div className="mb-4">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter text..."
          className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-gray-300 focus:outline-none focus:border-green-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gematriaSystems.map(system => (
          <div key={system.name} className="bg-gray-800 p-4 rounded">
            <h3 className="text-lg font-semibold text-green-400">{system.name}</h3>
            <p className="text-2xl text-green-300">{gematriaData[system.name] || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GematroDisplay;
