import React, { useState, useEffect } from 'react';

export const COMPANY_DETAILS = {
  companyName: "Blueprintel",
  contactPerson: "Bora Secgel",
  address: "1041 NW 2nd Ave, Fort Lauderdale, FL 33311",
  phone: "561-601-8721"
};

const FIREBASE_DB_URL = "https://blueprintle-default-rtdb.firebaseio.com"; // Realtime DB URL

export default function DriverPage() {
  const [rideStatus, setRideStatus] = useState('Assigned');
  const [rideId, setRideId] = useState('BP-1001');
  const [locationStatus, setLocationStatus] = useState('Location Tracking Off');

  // URL'den Ride ID çekme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const currentRideId = params.get('rideId');
      if (currentRideId) setRideId(currentRideId);
    }
  }, []);

  // Canlı Konum Takip Döngüsü (HTML5 Geolocation -> Firebase REST API)
  useEffect(() => {
    let intervalId = null;

    if (rideStatus === 'OTW' || rideStatus === 'On Location') {
      setLocationStatus('Sharing Live Location 📍');

      const sendLocation = () => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              
              // Firebase Realtime DB'ye konum yazma
              fetch(`${FIREBASE_DB_URL}/active_locations/${rideId}.json`, {
                method: 'PUT',
                body: JSON.stringify({
                  lat: latitude,
                  lng: longitude,
                  status: rideStatus,
                  updatedAt: new Date().toISOString()
                })
              }).catch(err => console.error("Location send error:", err));
            },
            (error) => {
              console.error("GPS Error:", error);
              setLocationStatus('GPS Access Denied');
            },
            { enableHighAccuracy: true }
          );
        }
      };

      sendLocation(); // İlk konumu anında gönder
      intervalId = setInterval(sendLocation, 15000); // Her 15 saniyede bir güncelle
    } else {
      setLocationStatus(rideStatus === 'Done' ? 'Ride Completed - Tracking Stopped' : 'Location Tracking Off');
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [rideStatus, rideId]);

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#111', marginBottom: '5px' }}>{COMPANY_DETAILS.companyName}</h2>
        <p style={{ color: '#666', fontSize: '14px', marginTop: '0' }}>Driver Job Status Panel</p>
        <hr style={{ border: '0.5px solid #eee', margin: '15px 0' }} />

        <div style={{ marginBottom: '15px' }}>
          <p><strong>Ride ID:</strong> #{rideId}</p>
          <p><strong>Passenger Address:</strong> {COMPANY_DETAILS.address}</p>
          <p><strong>Dispatch Contact:</strong> {COMPANY_DETAILS.phone}</p>
          <p><strong>Current Status:</strong> <span style={{ color: '#0070f3', fontWeight: 'bold' }}>{rideStatus}</span></p>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
            <strong>GPS Status:</strong> <span style={{ color: rideStatus === 'Done' ? '#22c55e' : '#0070f3' }}>{locationStatus}</span>
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          <button 
            onClick={() => setRideStatus('OTW')}
            style={{ padding: '12px', backgroundColor: rideStatus === 'OTW' ? '#0051a8' : '#0070f3', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            OTW (On The Way)
          </button>

          <button 
            onClick={() => setRideStatus('On Location')}
            style={{ padding: '12px', backgroundColor: rideStatus === 'On Location' ? '#d97706' : '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            On Location
          </button>

          <button 
            onClick={() => setRideStatus('Done')}
            style={{ padding: '12px', backgroundColor: rideStatus === 'Done' ? '#15803d' : '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
