import React, { useState, useEffect } from 'react';
import { computeGematria } from './cyphers';
import styles from './GematriaCalculator.module.css';

type GematriaEntry = {
  word: string;
  'English Cabala': number;
  'AQ Cipher': number;
  'Satanic Gematria': number;
  'Synx': number;
};

const cipherTitles = ['English Cabala', 'AQ Cipher', 'Satanic Gematria', 'Synx'];

const GematriaCalculator: React.FC = () => {
  const [input, setInput] = useState('');
  const [liveResult, setLiveResult] = useState<any>(null);
  const [entries, setEntries] = useState<GematriaEntry[]>([]);
  const [mainSystem, setMainSystem] = useState('English Cabala');

  useEffect(() => {
    if (input) {
      const result = computeGematria(input);
      setLiveResult(result);
    } else {
      setLiveResult(null);
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input && liveResult) {
      const newEntry: GematriaEntry = {
        word: input,
        'English Cabala': liveResult.find((r: any) => r.cipher === 'English Cabala')?.totalValue || 0,
        'AQ Cipher': liveResult.find((r: any) => r.cipher === 'AQ Cipher')?.totalValue || 0,
        'Satanic Gematria': liveResult.find((r: any) => r.cipher === 'Satanic Gematria')?.totalValue || 0,
        'Synx': liveResult.find((r: any) => r.cipher === 'Synx')?.totalValue || 0,
      };
      setEntries([newEntry, ...entries]);
      setInput('');
    }
  };

  const renderTotalValues = () => {
    if (!liveResult) return null;
    return (
      <div className={styles.totalValuesGrid}>
        {liveResult.map((result: any) => (
          <div key={result.cipher} className={styles.totalValueItem} data-cipher={result.cipher}>
            <h3 className={styles.heading}>{result.cipher}</h3>
            <div className={styles.totalValue}>
              {result.totalValue}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSelectedCipherPreview = () => {
    if (!liveResult) return null;
    const selectedResult = liveResult.find((r: any) => r.cipher === mainSystem);
    return (
      <div className={styles.selectedCipherPreview} data-cipher={mainSystem}>
        <h2 className={styles.heading}>{mainSystem}</h2>
        <div className={styles.letterValues}>
          {selectedResult.charValues.map((cv: any, index: number) => (
            <span key={index} className={styles.letterValue}>
              <span className={styles.letter}>{cv.char}</span>
              <span className={styles.value}>{cv.value !== null ? cv.value : '-'}</span>
            </span>
          ))}
        </div>
        <div className={styles.wordValues}>
          {selectedResult.wordValues.map((wv: any, index: number) => (
            <span key={index} className={styles.wordValue}>
              <span className={styles.word}>{wv.word}</span>
              <span className={styles.value}>{wv.value}</span>
            </span>
          ))}
        </div>
        <div className={styles.totalValue}>
          Total: {selectedResult.totalValue}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container} data-text="GEMATRIA">
      <div className={styles.leftColumn}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text..."
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Submit</button>
        </form>

        {renderTotalValues()}
      </div>

      <div className={styles.rightColumn}>
        <div className={styles.systemSelector}>
          {cipherTitles.map(title => (
            <button
              key={title}
              className={`${styles.systemButton} ${mainSystem === title ? styles.active : ''}`}
              onClick={() => setMainSystem(title)}
              data-cipher={title}
            >
              {title}
            </button>
          ))}
        </div>

        {renderSelectedCipherPreview()}
      </div>

      {entries.length > 0 && (
        <div className={styles.tableContainer}>
          <div className={styles.entriesTable}>
            <h2 className={styles.heading}>Submitted Entries</h2>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tr}>
                  <th className={styles.th}>Word</th>
                  {cipherTitles.map(title => (
                    <th key={title} className={styles.th} data-cipher={title}>{title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={index} className={styles.tr}>
                    <td className={styles.td}>{entry.word}</td>
                    {cipherTitles.map(title => (
                      <td key={title} className={styles.td} data-cipher={title}>{entry[title as keyof GematriaEntry]}</td>
                    ))}
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

export default GematriaCalculator;
