'use client';

import React, { useState, useEffect } from 'react';

export const COMPANY_DETAILS = {
  companyName: "Blueprintel",
  contactPerson: "Bora Secgel",
  address: "1041 NW 2nd Ave, Fort Lauderdale, FL 33311",
  phone: "561-601-8721"
};

export const DriverView = ({ bookingData }) => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn("Geolocation access denied or unavailable:", error.message);
        }
      );
    }
  }, []);

  const activeBooking = bookingData || {
    bookingId: "BP-9082",
    clientName: "Private Client",
    pickupAddress: "Fort Lauderdale Airport (FLL)",
    dropoffAddress: COMPANY_DETAILS.address,
    contactPhone: COMPANY_DETAILS.phone,
    providerCompany: COMPANY_DETAILS.companyName
  };

  return (
    <div className="driver-view-card" style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', fontFamily: 'Arial, sans-serif' }}>
      <h3>{activeBooking.providerCompany} - Driver Assignment Panel</h3>
      <hr />
      <div className="booking-details">
        <p><strong>Booking ID:</strong> {activeBooking.bookingId}</p>
        <p><strong>Passenger Name:</strong> {activeBooking.clientName}</p>
        <p><strong>Pickup Location:</strong> {activeBooking.pickupAddress}</p>
        <p><strong>Destination:</strong> {activeBooking.dropoffAddress}</p>
        <p><strong>Dispatch Contact:</strong> {activeBooking.contactPhone}</p>
      </div>

      {userLocation && (
        <div className="location-status" style={{ marginTop: '15px', color: '#28a745' }}>
          <small>Current Position: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</small>
        </div>
      )}
    </div>
  );
};

export default DriverView;
