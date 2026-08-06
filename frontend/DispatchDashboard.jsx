import React, { useState } from 'react';

export const COMPANY_DETAILS = {
  companyName: "Blueprintel",
  contactPerson: "Bora Secgel",
  address: "1041 NW 2nd Ave, Fort Lauderdale, FL 33311",
  phone: "561-601-8721"
};

export const DispatchDashboard = () => {
  const [statusMessage, setStatusMessage] = useState("");

  const sendDriverSMS = (driverPhone) => {
    // Generate a random token for driver link
    const token = Math.random().toString(36).substring(2, 10);
    const trackingLink = `https://blueprintel.com/track/${token}`;
    
    // Simulated SMS dispatch
    setStatusMessage(`SMS link sent to ${driverPhone || COMPANY_DETAILS.phone}: ${trackingLink}`);
    alert(`SMS successfully sent!\nLink: ${trackingLink}`);
  };

  return (
    <div className="dispatch-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>{COMPANY_DETAILS.companyName} - Dispatch Management Panel</h2>
      <div className="company-info-card" style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
        <h3>Company & Contact Details</h3>
        <p><strong>Manager:</strong> {COMPANY_DETAILS.contactPerson}</p>
        <p><strong>Address:</strong> {COMPANY_DETAILS.address}</p>
        <p><strong>Phone:</strong> {COMPANY_DETAILS.phone}</p>
      </div>

      <div className="action-panel">
        <button 
          onClick={() => sendDriverSMS(COMPANY_DETAILS.phone)}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Send SMS Link
        </button>
      </div>

      {statusMessage && <p style={{ marginTop: '15px', color: 'green' }}>{statusMessage}</p>}
    </div>
  );
};
