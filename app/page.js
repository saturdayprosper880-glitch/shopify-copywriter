'use client';

import { useState } from 'react';

export default function Home() {
  const [productDetails, setProductDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productDetails }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate copy');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '24px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', color: '#333' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Shopify Copywriter</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>Turn raw product ideas into high-converting store copy instantly.</p>

      <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <textarea
          rows="5"
          value={productDetails}
          onChange={(e) => setProductDetails(e.target.value)}
          placeholder="Enter raw product features (e.g., leather backpack, waterproof, fits 15-inch laptop, USB charging port)..."
          required
          style={{ padding: '12px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '14px', fontSize: '16px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}
        >
          {loading ? 'Writing Copy...' : 'Generate Product Copy'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '16px' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>{result.title}</h2>
          <p style={{ lineHeight: '1.5', marginBottom: '16px' }}>{result.description}</p>
          <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Key Highlights:</h3>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.4' }}>
            {result.bullets?.map((bullet, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>{bullet}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
