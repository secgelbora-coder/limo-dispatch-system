'use client';

import React, { useState } from 'react';

export const COMPANY_DETAILS = {
  companyName: "Blueprintel",
  contactPerson: "Bora Secgel",
  address: "1041 NW 2nd Ave, Fort Lauderdale, FL 33311",
  phone: "561-601-8721"
};

export const AdminDashboard = () => {
  // Sürücüler ve Yolculuklar Listesi
  const [drivers, setDrivers] = useState([
    { id: 1, name: "Bora Secgel", phone: "561-601-8721" }
  ]);

  const [rides, setRides] = useState([
    { id: "BP-1001", passenger: "John Doe", driver: "Bora Secgel", driverPhone: "561-601-8721", status: "Assigned" }
  ]);

  // Yeni Sürücü Ekleme State'leri
  const [newDriverName, setNewDriverName] = useState("");
  const [newDriverPhone, setNewDriverPhone] = useState("");

  const handleAddDriver = (e) => {
    e.preventDefault();
    if (!newDriverName || !newDriverPhone) return;

    const newDriver = {
      id: Date.now(),
      name: newDriverName,
      phone: newDriverPhone
    };

    setDrivers([...drivers, newDriver]);
    setNewDriverName("");
    setNewDriverPhone("");
    alert("New driver added successfully!");
  };

  const sendDriverSMS = (rideId, phone) => {
    const link = `https://blueprintel.com/driver?rideId=${rideId}`;
    alert(`SMS sent to ${phone}!\nTracking Link: ${link}`);
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>{COMPANY_DETAILS.companyName} - Admin & Dispatch Console</h1>
      <p><strong>Manager:</strong> {COMPANY_DETAILS.contactPerson} | <strong>Phone:</strong> {COMPANY_DETAILS.phone}</p>
      <hr style={{ margin: '20px 0' }} />

      {/* ADMIN EXCLUSIVE: Add New Driver Section */}
      <div style={{ backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>[Admin Action] Add New Driver</h3>
        <form onSubmit={handleAddDriver} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <input 
            type="text" 
            placeholder="Driver Name" 
            value={newDriverName} 
            onChange={(e) => setNewDriverName(e.target.value)}
            style={{ padding: '10px', flex: '1', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input 
            type="text" 
            placeholder="Phone Number" 
            value={newDriverPhone} 
            onChange={(e) => setNewDriverPhone(e.target.value)}
            style={{ padding: '10px', flex: '1', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button 
            type="submit" 
            style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Add Driver
          </button>
        </form>
      </div>

      {/* Live Rides & Dispatch Section */}
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px' }}>
        <h3>Live Dispatch & Ride Monitor</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '15px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '10px' }}>Ride ID</th>
              <th style={{ padding: '10px' }}>Passenger</th>
              <th style={{ padding: '10px' }}>Assigned Driver</th>
              <th style={{ padding: '10px' }}>Status</th>
              <th style={{ padding: '10px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rides.map((ride) => (
              <tr key={ride.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}><strong>{ride.id}</strong></td>
                <td style={{ padding: '10px' }}>{ride.passenger}</td>
                <td style={{ padding: '10px' }}>{ride.driver} ({ride.driverPhone})</td>
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
