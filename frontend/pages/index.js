'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use 'next/router' if using Pages Router

export default function HomePage() {
  const router = useRouter();
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleAdminAccess = (e) => {
    e.preventDefault();
    if (password === '1234') {
      setError(false);
      router.push('/admin');
    } else {
      setError(true);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f4f4f9',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ color: '#111', marginBottom: '10px' }}>Blueprintel</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>Dispatch & Transport Management</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {!showPasswordInput ? (
            <button 
              onClick={() => setShowPasswordInput(true)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#0070f3',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Admin Panel
            </button>
          ) : (
            <form onSubmit={handleAdminAccess} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: error ? '2px solid #ef4444' : '1px solid #ccc',
                  outline: 'none',
                  fontSize: '16px',
                  textAlign: 'center'
                }}
              />
              {error && <small style={{ color: '#ef4444' }}>Invalid password! Please try again.</small>}
              <button 
                type="submit"
                style={{
                  padding: '12px',
                  backgroundColor: '#22c55e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Log In
              </button>
            </form>
          )}

          <button 
            onClick={() => router.push('/driver')}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#111111',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Driver Panel
          </button>
        </div>
      </div>
    </div>
  );
}
