import React, { useState } from 'react';

export const COMPANY_DETAILS = {
  companyName: "Blueprintel",
  contactPerson: "Bora Secgel",
  address: "1041 NW 2nd Ave, Fort Lauderdale, FL 33311",
  phone: "561-601-8721"
};

export default function AdminPage() {
  const [drivers, setDrivers] = useState([
    { id: 1, name: "Bora Secgel", phone: "561-601-8721" }
  ]);

  const [rides, setRides] = useState([
    {
      id: "BP-1001",
      customerName: "John Doe",
      affiliateCompany: "A1 Limo Corp",
      customerPhone: "561-555-0199",
      pickupAddress: "Fort Lauderdale Airport (FLL)",
      dropoffAddress: "1041 NW 2nd Ave, Fort Lauderdale, FL",
      serviceType: "Transfer",
      notes: "VIP Client, requires child seat",
      driver: "Bora Secgel",
      driverPhone: "561-601-8721",
      status: "Assigned"
    }
  ]);

  // State for Adding New Driver
  const [newDriverName, setNewDriverName] = useState("");
  const [newDriverPhone, setNewDriverPhone] = useState("");

  // State for Creating New Ride Job
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

  const handleCreateRide = (e) => {
    e.preventDefault();
    if (!newRide.customerName || !newRide.pickupAddress || !newRide.driverId) {
      alert("Please fill in Customer Name, Pick-up Address, and assign a Driver.");
      return;
    }

    const assignedDriver = drivers.find(d => d.id.toString() === newRide.driverId.toString());

    const createdRide = {
      id: `BP-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newRide.customerName,
      affiliateCompany: newRide.affiliateCompany || "N/A",
      customerPhone: newRide.customerPhone || "N/A",
      pickupAddress: newRide.pickupAddress,
      dropoffAddress: newRide.dropoffAddress || "As Directed",
      serviceType: newRide.serviceType,
      notes: newRide.notes || "None",
      driver: assignedDriver ? assignedDriver.name : "Unassigned",
      driverPhone: assignedDriver ? assignedDriver.phone : "",
      status: "Assigned"
    };

    setRides([createdRide, ...rides]);
    
    // Reset Form
    setNewRide({
      customerName: "",
      affiliateCompany: "",
      customerPhone: "",
      pickupAddress: "",
      dropoffAddress: "",
      serviceType: "Transfer",
      notes: "",
      driverId: ""
    });

    alert(`Job #${createdRide.id} created successfully!`);
  };

  const sendDriverWhatsApp = (ride) => {
    const cleanPhone = ride.driverPhone.replace(/[^0-9]/g, '');
    const trackingLink = `https://blueprintel.com/driver?rideId=${ride.id}`;

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

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
      <h1>{COMPANY_DETAILS.companyName} - Admin & Dispatch Console</h1>
      <p><strong>Manager:</strong> {COMPANY_DETAILS.contactPerson} | <strong>Phone:</strong> {COMPANY_DETAILS.phone}</p>
      <hr style={{ margin: '20px 0' }} />

      {/* SECTION 1: ADD NEW DRIVER */}
      <div style={{ backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
        <h3>Add New Driver</h3>
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

      {/* SECTION 2: CREATE NEW RIDE JOB */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #d0d7de', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0 }}>Create & Dispatch New Job</h3>
        <form onSubmit={handleCreateRide} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Customer Name *</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              value={newRide.customerName} 
              onChange={(e) => setNewRide({ ...newRide, customerName: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Affiliate / Company Name</label>
            <input 
              type="text" 
              placeholder="e.g. Global Limo Inc." 
              value={newRide.affiliateCompany} 
              onChange={(e) => setNewRide({ ...newRide, affiliateCompany: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Customer Phone Number</label>
            <input 
              type="text" 
              placeholder="561-000-0000" 
              value={newRide.customerPhone} 
              onChange={(e) => setNewRide({ ...newRide, customerPhone: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Service Type</label>
            <select 
              value={newRide.serviceType} 
              onChange={(e) => setNewRide({ ...newRide, serviceType: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="Transfer">Point to Point (Transfer)</option>
              <option value="As Directed (Hourly)">As Directed (Hourly)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Pick-up Address *</label>
            <input 
              type="text" 
              placeholder="Pick-up Location" 
              value={newRide.pickupAddress} 
              onChange={(e) => setNewRide({ ...newRide, pickupAddress: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Drop-off Address</label>
            <input 
              type="text" 
              placeholder="Drop-off Location (or N/A for Hourly)" 
              value={newRide.dropoffAddress} 
              onChange={(e) => setNewRide({ ...newRide, dropoffAddress: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Assign Driver *</label>
            <select 
              value={newRide.driverId} 
              onChange={(e) => setNewRide({ ...newRide, driverId: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">Select Driver</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.phone})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Special Notes / Instructions</label>
            <input 
              type="text" 
              placeholder="Flight #, Luggage, VIP requests..." 
              value={newRide.notes} 
              onChange={(e) => setNewRide({ ...newRide, notes: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2', textAlign: 'right', marginTop: '10px' }}>
            <button 
              type="submit" 
              style={{ padding: '12px 24px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}
            >
              Dispatch Job
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 3: LIVE DISPATCH & RIDE MONITOR */}
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
                  <small style={{ color: '#666' }}>{ride.affiliateCompany}</small><br/>
                  <small style={{ color: '#666' }}>{ride.customerPhone}</small>
                </td>
                <td style={{ padding: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0070f3' }}>{ride.serviceType}</span><br/>
                  <strong>From:</strong> {ride.pickupAddress}<br/>
                  <strong>To:</strong> {ride.dropoffAddress}<br/>
                  <small style={{ color: '#888' }}>Note: {ride.notes}</small>
                </td>
                <td style={{ padding: '10px' }}>{ride.driver}<br/><small style={{ color: '#666' }}>{ride.driverPhone}</small></td>
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
                    onClick={() => sendDriverWhatsApp(ride)}
                    style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
                  >
                    Send WhatsApp
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
