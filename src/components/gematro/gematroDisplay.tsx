import React, { useState, useEffect } from 'react';
import { generateGematriaData } from './generateGematriaData';

const GematroDisplay: React.FC = () => {
  const [input, setInput] = useState('');
  const [gematriaData, setGematriaData] = useState<{ [key: string]: number }>({});
  const [showTable, setShowTable] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setInput(newInput);
    setGematriaData(generateGematriaData(newInput));
  };

  useEffect(() => {
    setShowTable(Object.keys(gematriaData).length > 0);
  }, [gematriaData]);

  const displayValue = (value: number | undefined) => {
    return typeof value === 'number' && !isNaN(value) ? value : 0;
  };

  return (
    <div className="h-screen flex flex-col">
      <div className={`flex-grow flex flex-col ${showTable ? 'justify-start' : 'justify-center'}`}>
        <div className="flex flex-col md:flex-row w-full gap-4 p-4">
          <div className="w-full md:w-1/2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Enter text..."
              className="w-full p-2 border border-gray-300 rounded"
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Summary Preview</h3>
              <p>English Ordinal: {displayValue(gematriaData['English Ordinal'])}</p>
              <p>English Summary: {displayValue(gematriaData['English Summary'])}</p>
              <p>Aiq Bekar: {displayValue(gematriaData['Aiq Bekar'])}</p>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-semibold">Summary Preview</h3>
            <p>English Ordinal: {displayValue(gematriaData['English Ordinal'])}</p>
            <p>English Summary: {displayValue(gematriaData['English Summary'])}</p>
            <p>Aiq Bekar: {displayValue(gematriaData['Aiq Bekar'])}</p>
          </div>
        </div>
      </div>

      {showTable && (
        <div className="flex-grow overflow-y-auto">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Cypher</th>
                  <th className="border p-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(gematriaData).map(([cypher, value]) => (
                  <tr key={cypher}>
                    <td className="border p-2">{cypher}</td>
                    <td className="border p-2">{displayValue(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GematroDisplay;
