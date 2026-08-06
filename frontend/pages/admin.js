import React, { useState, useEffect, useRef } from 'react';

export const COMPANY_DETAILS = {
  companyName: "Blueprintel",
  contactPerson: "Bora Secgel",
  address: "1041 NW 2nd Ave, Fort Lauderdale, FL 33311",
  phone: "561-601-8721"
};

const GOOGLE_MAPS_API_KEY = "AIzaSyBEzBK4p5Yi1jrwe6_0gz8mYAfwrQpYAOs";
const FIREBASE_DB_URL = "https://blueprintle-default-rtdb.firebaseio.com";

export default function AdminPage() {
  const pickupInputRef = useRef(null);
  const dropoffInputRef = useRef(null);
  const mapRef = useRef(null);
  const googleMapInstance = useRef(null);
  const driverMarkerRef = useRef(null);

  const [drivers, setDrivers] = useState([]);
  const [rides, setRides] = useState([]);

  const [newDriverName, setNewDriverName] = useState("");
  const [newDriverPhone, setNewDriverPhone] = useState("");

  const [newRide, setNewRide] = useState({
    customerName: "",
    affiliateCompany: "",
    customerPhone: "",
    pickupAddress: "",
    dropoffAddress: "",
    serviceType: "Transfer",
    notes: "",
    driverId: ""
  });

  const [activeTrackingRide, setActiveTrackingRide] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);

  // 1. FIREBASE'DEN SÜRÜCÜLERİ VE İŞLERİ CANLI ÇEKME
  useEffect(() => {
    const fetchData = () => {
      // Sürücüleri Çek
      fetch(`${FIREBASE_DB_URL}/drivers.json`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            const driverList = Object.keys(data).map(key => ({
              id: key,
              name: data[key].name,
              phone: data[key].phone
            }));
            setDrivers(driverList);
          } else {
            const defaultDriver = { name: "Bora Secgel", phone: "561-601-8721" };
            fetch(`${FIREBASE_DB_URL}/drivers/1.json`, { method: 'PUT', body: JSON.stringify(defaultDriver) });
            setDrivers([{ id: '1', ...defaultDriver }]);
          }
        }).catch(err => console.error("Drivers fetch error:", err));

      // İşleri Çek
      fetch(`${FIREBASE_DB_URL}/rides.json`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            const rideList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
            setRides(rideList.reverse());
          }
        }).catch(err => console.error("Rides fetch error:", err));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // 2. GOOGLE MAPS AUTOCOMPLETE
  useEffect(() => {
    if (!window.google && !document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = initAutocomplete;
      document.body.appendChild(script);
    } else if (window.google) {
      initAutocomplete();
    }

    function initAutocomplete() {
      if (!window.google || !window.google.maps || !window.google.maps.places) return;

      if (pickupInputRef.current) {
        const pickupAutocomplete = new window.google.maps.places.Autocomplete(pickupInputRef.current, {
          types: ['geocode', 'establishment'],
          componentRestrictions: { country: 'us' }
        });

        pickupAutocomplete.addListener('place_changed', () => {
          const place = pickupAutocomplete.getPlace();
          if (place && place.formatted_address) {
            setNewRide(prev => ({ ...prev, pickupAddress: place.formatted_address }));
          }
        });
      }

      if (dropoffInputRef.current) {
        const dropoffAutocomplete = new window.google.maps.places.Autocomplete(dropoffInputRef.current, {
          types: ['geocode', 'establishment'],
          componentRestrictions: { country: 'us' }
        });

        dropoffAutocomplete.addListener('place_changed', () => {
          const place = dropoffAutocomplete.getPlace();
          if (place && place.formatted_address) {
            setNewRide(prev => ({ ...prev, dropoffAddress: place.formatted_address }));
          }
        });
      }
    }
  }, []);

  // 3. FIREBASE CANLI KONUM DİNLEYİCİ
  useEffect(() => {
    let intervalId = null;

    if (activeTrackingRide) {
      const fetchLocation = () => {
        fetch(`${FIREBASE_DB_URL}/active_locations/${activeTrackingRide.id}.json`)
          .then(res => res.json())
          .then(data => {
            if (data && data.lat && data.lng) {
              setDriverLocation(data);
            }
          })
          .catch(err => console.error("Firebase fetch error:", err));
      };

      fetchLocation();
      intervalId = setInterval(fetchLocation, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeTrackingRide]);

  // 4. HARİTA ÇİZİMİ
  useEffect(() => {
    if (activeTrackingRide && driverLocation && mapRef.current && window.google) {
      const pos = { lat: driverLocation.lat, lng: driverLocation.lng };

      if (!googleMapInstance.current) {
        googleMapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: pos,
          zoom: 15,
        });

        driverMarkerRef.current = new window.google.maps.Marker({
          position: pos,
          map: googleMapInstance.current,
          title: activeTrackingRide.driver,
          icon: 'https://maps.google.com/mapfiles/kml/shapes/cabs.png'
        });
      } else {
        driverMarkerRef.current.setPosition(pos);
        googleMapInstance.current.panTo(pos);
      }
    }
  }, [driverLocation, activeTrackingRide]);

  // SÜRÜCÜ EKLEME
  const handleAddDriver = (e) => {
    e.preventDefault();
    if (!newDriverName || !newDriverPhone) return;

    const driverId = Date.now().toString();
    const driverData = { name: newDriverName, phone: newDriverPhone };

    fetch(`${FIREBASE_DB_URL}/drivers/${driverId}.json`, {
      method: 'PUT',
      body: JSON.stringify(driverData)
    }).then(() => {
      setDrivers(prev => [...prev, { id: driverId, ...driverData }]);
      setNewDriverName("");
      setNewDriverPhone("");
      alert("New driver saved to database!");
    });
  };

  // İŞ OLUŞTURMA
  const handleCreateRide = (e) => {
    e.preventDefault();
    if (!newRide.customerName || !newRide.pickupAddress || !newRide.driverId) {
      alert("Please fill in Customer Name, Pick-up Address, and assign a Driver.");
      return;
    }

    const assignedDriver = drivers.find(d => d.id.toString() === newRide.driverId.toString());
    const rideId = `BP-${Math.floor(1000 + Math.random() * 9000)}`;

    const createdRide = {
      customerName: newRide.customerName,
      affiliateCompany: newRide.affiliateCompany || "N/A",
      customerPhone: newRide.customerPhone || "N/A",
      pickupAddress: newRide.pickupAddress,
      dropoffAddress: newRide.dropoffAddress || "As Directed",
      serviceType: newRide.serviceType,
      notes: newRide.notes || "None",
      driver: assignedDriver ? assignedDriver.name : "Unassigned",
      driverPhone: assignedDriver ? assignedDriver.phone : "",
      status: "Assigned",
      createdAt: new Date().toISOString()
    };

    fetch(`${FIREBASE_DB_URL}/rides/${rideId}.json`, {
      method: 'PUT',
      body: JSON.stringify(createdRide)
    }).then(() => {
      setRides([{ id: rideId, ...createdRide }, ...rides]);
      setNewRide({ customerName: "", affiliateCompany: "", customerPhone: "", pickupAddress: "", dropoffAddress: "", serviceType: "Transfer", notes: "", driverId: "" });
      alert(`Job #${rideId} dispatched and saved to database!`);
    });
  };

  const sendDriverWhatsApp = (ride) => {
    const cleanPhone = '1' + ride.driverPhone.replace(/[^0-9]/g, '');
    const trackingLink = `${window.location.origin}/driver?rideId=${ride.id}`;

    const messageText = 
`🚗 *NEW JOB DISPATCH - #${ride.id}*

• *Customer:* ${ride.customerName}
• *Affiliate/Company:* ${ride.affiliateCompany}
• *Customer Phone:* ${ride.customerPhone}
• *Service Type:* ${ride.serviceType}
• *Pick-up:* ${ride.pickupAddress}
• *Drop-off:* ${ride.dropoffAddress}
• *Special Notes:* ${ride.notes}

📍 *Update Status Link:*
${trackingLink}`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`, '_blank');
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
      <h1>{COMPANY_DETAILS.companyName} - Admin & Dispatch Console</h1>
      <p><strong>Manager:</strong> {COMPANY_DETAILS.contactPerson} | <strong>Phone:</strong> {COMPANY_DETAILS.phone}</p>
      <hr style={{ margin: '20px 0' }} />

      {/* ADD DRIVER */}
      <div style={{ backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
        <h3>Add New Driver</h3>
        <form onSubmit={handleAddDriver} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <input type="text" placeholder="Driver Name" value={newDriverName} onChange={(e) => setNewDriverName(e.target.value)} style={{ padding: '10px', flex: '1', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input type="text" placeholder="Phone Number" value={newDriverPhone} onChange={(e) => setNewDriverPhone(e.target.value)} style={{ padding: '10px', flex: '1', borderRadius: '4px', border: '1px solid #ccc' }} />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Add Driver</button>
        </form>
      </div>

      {/* CREATE RIDE */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #d0d7de', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0 }}>Create & Dispatch New Job</h3>
        <form onSubmit={handleCreateRide} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Customer Name *</label>
            <input type="text" placeholder="John Doe" value={newRide.customerName} onChange={(e) => setNewRide({ ...newRide, customerName: e.target.value })} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Affiliate / Company Name</label>
            <input type="text" placeholder="e.g. Global Limo Inc." value={newRide.affiliateCompany} onChange={(e) => setNewRide({ ...newRide, affiliateCompany: e.target.value })} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Customer Phone Number</label>
            <input type="text" placeholder="561-000-0000" value={newRide.customerPhone} onChange={(e) => setNewRide({ ...newRide, customerPhone: e.target.value })} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Service Type</label>
            <select value={newRide.serviceType} onChange={(e) => setNewRide({ ...newRide, serviceType: e.target.value })} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="Transfer">Point to Point (Transfer)</option>
              <option value="As Directed (Hourly)">As Directed (Hourly)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Pick-up Address * (Google Validated)</label>
            <input ref={pickupInputRef} type="text" placeholder="Start typing pick-up location..." value={newRide.pickupAddress} onChange={(e) => setNewRide({ ...newRide, pickupAddress: e.target.value })} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Drop-off Address (Google Validated)</label>
            <input ref={dropoffInputRef} type="text" placeholder="Start typing drop-off location..." value={newRide.dropoffAddress} onChange={(e) => setNewRide({ ...newRide, dropoffAddress: e.target.value })} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Assign Driver *</label>
            <select value={newRide.driverId} onChange={(e) => setNewRide({ ...newRide, driverId: e.target.value })} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="">Select Driver</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id.toString()}>
                  {d.name} ({d.phone})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Special Notes / Instructions</label>
            <input type="text" placeholder="Flight #, Luggage, VIP requests..." value={newRide.notes} onChange={(e) => setNewRide({ ...newRide, notes: e.target.value })} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ gridColumn: 'span 2', textAlign: 'right', marginTop: '10px' }}>
            <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>Dispatch Job</button>
          </div>
        </form>
      </div>

      {/* DISPATCH MONITOR */}
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px' }}>
        <h3>Live Dispatch & Ride Monitor</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '15px', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f4f4f5' }}>
              <th style={{ padding: '10px' }}>Ride ID</th>
              <th style={{ padding: '10px' }}>Customer / Company</th>
              <th style={{ padding: '10px' }}>Type & Addresses</th>
              <th style={{ padding: '10px' }}>Assigned Driver</th>
              <th style={{ padding: '10px' }}>Status</th>
              <th style={{ padding: '10px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rides.map((ride) => (
              <tr key={ride.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}><strong>{ride.id}</strong></td>
                <td style={{ padding: '10px' }}>
                  <strong>{ride.customerName}</strong><br/>
                  <small style={{ color: '#666' }}>{ride.affiliateCompany}</small>
                </td>
                <td style={{ padding: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0070f3' }}>{ride.serviceType}</span><br/>
                  <strong>From:</strong> {ride.pickupAddress}<br/>
                  <strong>To:</strong> {ride.dropoffAddress}
                </td>
                <td style={{ padding: '10px' }}>{ride.driver}<br/><small style={{ color: '#666' }}>{ride.driverPhone}</small></td>
                <td style={{ padding: '10px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', color: '#fff', backgroundColor: (ride.status === 'Drop Off' || ride.status === 'Done') ? '#22c55e' : ride.status === 'POB' ? '#7c3aed' : ride.status === 'On Location' ? '#f59e0b' : ride.status === 'OTW' ? '#0070f3' : '#6b7280' }}>
                    {ride.status}
                  </span>
                </td>
                <td style={{ padding: '10px', display: 'flex', gap: '5px' }}>
                  <button onClick={() => sendDriverWhatsApp(ride)} style={{ padding: '6px 10px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                    WhatsApp
                  </button>
                  <button onClick={() => setActiveTrackingRide(ride)} style={{ padding: '6px 10px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Live Map 📍
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LIVE MAP MODAL */}
      {activeTrackingRide && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', width: '90%', maxWidth: '700px', boxShadow: '0 5px 20px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>Live Driver Tracking - Job #{activeTrackingRide.id}</h3>
              <button onClick={() => { setActiveTrackingRide(null); setDriverLocation(null); googleMapInstance.current = null; }} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Close X</button>
            </div>
            <p style={{ fontSize: '14px', margin: '0 0 10px 0' }}><strong>Driver:</strong> {activeTrackingRide.driver} | <strong>Status:</strong> {driverLocation ? `Active (Last update: ${new Date(driverLocation.updatedAt).toLocaleTimeString()})` : 'Waiting for GPS signal...'}</p>
            <div ref={mapRef} style={{ width: '100%', height: '400px', borderRadius: '8px', backgroundColor: '#eee' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}
