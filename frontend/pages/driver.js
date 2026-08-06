import React, { useState, useEffect } from 'react';

export const COMPANY_DETAILS = {
  companyName: "Blueprintel",
  contactPerson: "Bora Secgel",
  address: "1041 NW 2nd Ave, Fort Lauderdale, FL 33311",
  phone: "561-601-8721"
};

const FIREBASE_DB_URL = "https://blueprintle-default-rtdb.firebaseio.com";

export default function DriverPage() {
  const [rideStatus, setRideStatus] = useState('Assigned');
  const [rideId, setRideId] = useState('BP-1001');
  const [locationStatus, setLocationStatus] = useState('Location Tracking Off');

  // Örnek Müşteri ve İş Bilgileri (İleride Veritabanından Dinamik Gelecek)
  const [rideDetails, setRideDetails] = useState({
    customerName: "John Doe",
    affiliateCompany: "A1 Limo Corp",
    customerPhone: "561-555-0199",
    pickupAddress: "Fort Lauderdale Airport (FLL)",
    dropoffAddress: "1041 NW 2nd Ave, Fort Lauderdale, FL 33311",
    serviceType: "Transfer",
    notes: "VIP Client, needs child seat"
  });

  // URL'den Ride ID Çekme
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

      sendLocation();
      intervalId = setInterval(sendLocation, 15000);
    } else {
      setLocationStatus(rideStatus === 'Done' ? 'Ride Completed - Tracking Stopped' : 'Location Tracking Off');
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [rideStatus, rideId]);

  // Cihazın Kendi Haritasında Navigasyon / Yol Tarifi Açma
  const openDirections = (address) => {
    if (!address) return;
    const encodedAddress = encodeURIComponent(address);
    // Google Maps Universal Link (Hem iOS hem Android cihazlarda haritayı açar)
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
        
        {/* ÜST BAŞLIK */}
        <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
          <h2 style={{ color: '#111', margin: '0 0 5px 0' }}>{COMPANY_DETAILS.companyName}</h2>
          <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>Driver Dispatch Console • <strong>Job #{rideId}</strong></p>
        </div>

        {/* MÜŞTERİ BİLGİLERİ */}
        <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '15px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '14px', textTransform: 'uppercase' }}>Passenger Details</h4>
          
          <p style={{ margin: '5px 0', fontSize: '15px' }}><strong>Name:</strong> {rideDetails.customerName}</p>
          <p style={{ margin: '5px 0', fontSize: '14px', color: '#64748b' }}><strong>Company:</strong> {rideDetails.affiliateCompany}</p>
          
          {/* Müşteriyi Arama Butonu */}
          <div style={{ marginTop: '10px' }}>
            <a 
              href={`tel:${rideDetails.customerPhone}`} 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', backgroundColor: '#0284c7', color: '#fff', padding: '8px 12px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}
            >
              📞 Call Passenger ({rideDetails.customerPhone})
            </a>
          </div>
        </div>

        {/* LOKASYONLAR VE YOL TARİFİ BUTONLARI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '15px' }}>
          
          {/* PICK-UP ADDRESS */}
          <div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px', backgroundColor: '#f1f5f9' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb', marginBottom: '4px' }}>PICK-UP LOCATION</div>
            <div style={{ fontSize: '14px', color: '#1e293b', marginBottom: '8px' }}>{rideDetails.pickupAddress}</div>
            <button 
              onClick={() => openDirections(rideDetails.pickupAddress)}
              style={{ padding: '8px 12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', width: '100%' }}
            >
              🗺️ Get Directions to Pick-up
            </button>
          </div>

          {/* DROP-OFF ADDRESS */}
          <div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px', backgroundColor: '#f1f5f9' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669', marginBottom: '4px' }}>DROP-OFF LOCATION</div>
            <div style={{ fontSize: '14px', color: '#1e293b', marginBottom: '8px' }}>{rideDetails.dropoffAddress}</div>
            <button 
              onClick={() => openDirections(rideDetails.dropoffAddress)}
              style={{ padding: '8px 12px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', width: '100%' }}
            >
              🗺️ Get Directions to Drop-off
            </button>
          </div>
        </div>

        {/* ÖZEL NOTLAR */}
        {rideDetails.notes && (
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', padding: '10px 12px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px', color: '#92400e' }}>
            <strong>Special Notes:</strong> {rideDetails.notes}
          </div>
        )}

        {/* GPS DURUMU */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginBottom: '15px' }}>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
            <strong>GPS Live Tracking:</strong> <span style={{ color: rideStatus === 'Done' ? '#16a34a' : '#2563eb', fontWeight: 'bold' }}>{locationStatus}</span>
          </p>
        </div>

        {/* DURUM GÜNCELLEME BUTONLARI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            onClick={() => setRideStatus('OTW')}
            style={{ padding: '12px', backgroundColor: rideStatus === 'OTW' ? '#1d4ed8' : '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}
          >
            OTW (On The Way)
          </button>

          <button 
            onClick={() => setRideStatus('On Location')}
            style={{ padding: '12px', backgroundColor: rideStatus === 'On Location' ? '#d97706' : '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}
          >
            On Location
          </button>

          <button 
            onClick={() => setRideStatus('Done')}
            style={{ padding: '12px', backgroundColor: rideStatus === 'Done' ? '#15803d' : '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
