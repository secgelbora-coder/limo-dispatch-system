import React from 'react';

export const DriverView = ({ bookingData }) => {
  const activeBooking = bookingData || {
    bookingId: "BP-9082",
    clientName: "Private Client",
    pickupAddress: "Fort Lauderdale Airport (FLL)",
    dropoffAddress: "1041 NW 2nd Ave, Fort Lauderdale, FL 33311",
    contactPhone: "561-601-8721",
    providerCompany: "Blueprintel"
  };

  return (
    <div className="driver-view-card" style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
      <h3>{activeBooking.providerCompany} - Active Driver Assignment</h3>
      <hr />
      <p><strong>Booking ID:</strong> {activeBooking.bookingId}</p>
      <p><strong>Passenger Name:</strong> {activeBooking.clientName}</p>
      <p><strong>Pickup Location:</strong> {activeBooking.pickupAddress}</p>
      <p><strong>Destination:</strong> {activeBooking.dropoffAddress}</p>
      <p><strong>Dispatch Contact:</strong> {activeBooking.contactPhone}</p>
    </div>
  );
};
