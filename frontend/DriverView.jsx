'use client';

import React, { useState } from 'react';

export const COMPANY_DETAILS = {
  companyName: "Blueprintel",
  contactPerson: "Bora Secgel",
  address: "1041 NW 2nd Ave, Fort Lauderdale, FL 33311",
  phone: "561-601-8721"
};

export const DriverView = ({ rideId = "BP-1001" }) => {
  const [rideStatus, setRideStatus] = useState('Assigned');

  const updateStatus = (newStatus) => {
    setRideStatus(newStatus);
    // Buradan dilerseniz backend API'nize veya WebSocket/Supabase servisinize status güncellendi bilgisini atabilirsiniz.
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#111', marginBottom: '5px' }}>{COMPANY_DETAILS.companyName}</h2>
        <p style={{ color: '#666', fontSize: '14px', marginTop: '0' }}>Driver Job Status Panel</p>
        <hr style={{ border: '0.5px solid #eee', margin: '15px 0' }} />

        <div style={{ marginBottom: '15px' }}>
          <p><strong>Ride ID:</strong> {rideId}</p>
          <p><strong>Passenger Address:</strong> {COMPANY_DETAILS.address}</p>
          <p><strong>Dispatch Contact:</strong> {COMPANY_DETAILS.phone}</p>
          <p><strong>Current Status:</strong> <span style={{ color: '#0070f3', fontWeight: 'bold' }}>{rideStatus}</span></p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          <button 
            onClick={() => updateStatus('OTW')}
            style={{ padding: '12px', backgroundColor: rideStatus === 'OTW' ? '#0051a8' : '#0070f3', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            OTW (On The Way)
          </button>

          <button 
            onClick={() => updateStatus('On Location')}
            style={{ padding: '12px', backgroundColor: rideStatus === 'On Location' ? '#d97706' : '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            On Location
          </button>

          <button 
            onClick={() => updateStatus('Done')}
            style={{ padding: '12px', backgroundColor: rideStatus === 'Done' ? '#15803d' : '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverView;
