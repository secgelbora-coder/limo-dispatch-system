'use client';

import React, { useState } from 'react';

export const COMPANY_DETAILS = {
  companyName: "Blueprintel",
  contactPerson: "Bora Secgel",
  address: "1041 NW 2nd Ave, Fort Lauderdale, FL 33311",
  phone: "561-601-8721"
};

export const AdminDashboard = () => {
  const [rides, setRides] = useState([
    { id: "BP-1001", passenger: "John Doe", driverPhone: "561-601-8721", status: "Assigned" },
    { id: "BP-1002", passenger: "Jane Smith", driverPhone: "561-555-0199", status: "OTW" },
    { id: "BP-1003", passenger: "Alice Johnson", driverPhone: "561-555-0188", status: "On Location" }
  ]);

  const sendDriverSMS = (rideId, phone) => {
    const link = `https://${COMPANY_DETAILS.companyName.toLowerCase()}.com/driver?rideId=${rideId}`;
    alert(`SMS sent to ${phone}!\nTracking Link: ${link}`);
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1>{COMPANY_DETAILS.companyName} - Dispatch & Admin Control</h1>
      <p>Manager: {COMPANY_DETAILS.contactPerson} | Phone: {COMPANY_DETAILS.phone}</p>
      
      <div style={{ marginTop: '20px', border: '1px solid #ccc', borderRadius: '8px', padding: '20px' }}>
        <h3>Live Ride Tracker</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '10px' }}>Ride ID</th>
              <th style={{ padding: '10px' }}>Passenger</th>
              <th style={{ padding: '10px' }}>Driver Phone</th>
              <th style={{ padding: '10px' }}>Current Status</th>
              <th style={{ padding: '10px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rides.map((ride) => (
              <tr key={ride.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}><strong>{ride.id}</strong></td>
                <td style={{ padding: '10px' }}>{ride.passenger}</td>
                <td style={{ padding: '10px' }}>{ride.driverPhone}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#fff',
                    backgroundColor: ride.status === 'Done' ? '#22c55e' : ride.status === 'On Location' ? '#f59e0b' : ride.status === 'OTW' ? '#0070f3' : '#6b7280'
                  }}>
                    {ride.status}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  <button 
                    onClick={() => sendDriverSMS(ride.id, ride.driverPhone)}
                    style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '4px' }}
                  >
                    Send SMS Link
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
