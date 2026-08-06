import React, { useState } from 'react';
import { openNavigation } from './navigation';

export default function DriverView({ tripData }) {
  const [status, setStatus] = useState(tripData?.status || 'On The Way');
  const [showSignage, setShowSignage] = useState(false);

  // GPS Konumu Alıp Backend'e ve Panellere Gönderen Fonksiyon
  const updateStatus = (newStatus) => {
    setStatus(newStatus);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Status: ${newStatus} | GPS: ${latitude}, ${longitude}`);
          // Burada Supabase / API servisine anlık GPS & Status push edilir
        },
        (error) => console.error("GPS Alınamadı:", error),
        { enableHighAccuracy: true }
      );
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen p-4 font-sans text-gray-800">
      {/* Şirket Logosu & Saat Bilgisi */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-3 text-center border-t-4 border-black">
        <h1 className="text-xl font-bold tracking-wide">{tripData?.companyName || "SLADE SERVICES"}</h1>
        <p className="text-sm text-gray-500">{tripData?.pickupTime || "9:30 AM"} - #{tripData?.tripId || "41711"}</p>
      </div>

      {/* Yolcu Kartı */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
        <span className="text-xs font-bold text-gray-400 tracking-wider">PASSENGER INFO</span>
        <div className="flex justify-between items-center mt-2">
          <div>
            <h2 className="text-lg font-bold">{tripData?.passengerName || "Ed Butera"}</h2>
            <p className="text-red-600 font-semibold text-sm">{tripData?.passengerPhone || "(561) 706-1976"}</p>
            <p className="text-xs text-gray-400">{tripData?.passengerCount || 1} passenger</p>
          </div>
          <a href={`tel:${tripData?.passengerPhone}`} className="bg-gray-100 p-3 rounded-full text-green-600">
            📞
          </a>
        </div>
      </div>

      {/* Rota & Uçuş Bilgisi */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
        <span className="text-xs font-bold text-gray-400 tracking-wider">ROUTING</span>
        <div className="mt-2 space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded font-bold mt-0.5">PU</span>
            <p>{tripData?.pickupAddress || "1050 NW 1st Ave Boca Raton FL 33432"}</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-slate-800 text-white text-xs px-2 py-0.5 rounded font-bold mt-0.5">DO</span>
            <div>
              <p>{tripData?.dropoffAddress || "FLL - Fort Lauderdale-Hollywood International Airport"}</p>
              <p className="text-xs text-gray-400 italic">Drop-off: {tripData?.dropoffTime || "10:30 AM"}</p>
            </div>
          </div>
        </div>

        {/* Uçuş Bilgisi */}
        {tripData?.flightCode && (
          <div className="mt-3 pt-3 border-t text-sm font-semibold flex items-center gap-2 text-gray-700">
            ✈️ UAL {tripData.flightCode}
          </div>
        )}

        {/* Karşılama Tabelası Butonu */}
        <button 
          onClick={() => setShowSignage(true)}
          className="w-full mt-3 py-2 border rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          📇 Get Signage
        </button>
      </div>

      {/* Durum Butonları (Workflow) */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-20 space-y-2">
        <span className="text-xs font-bold text-gray-400 tracking-wider block mb-2">STATUS</span>
        
        {['On The Way', 'Arrived', 'Customer In Car', 'Dropped'].map((step) => (
          <button
            key={step}
            onClick={() => updateStatus(step)}
            className={`w-full p-3 rounded-lg text-left font-semibold border flex justify-between items-center transition ${
              status === step 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-gray-200 text-gray-600'
            }`}
          >
            <span>{step}</span>
            {status === step && <span>✓</span>}
          </button>
        ))}
      </div>

      {/* Alt Sabit Navigasyon & İletişim Barı */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-3 bg-white border-t flex gap-2">
        <button 
          onClick={() => openNavigation(tripData?.lat || 26.358, tripData?.lng || -80.083, tripData?.pickupAddress)}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg text-center"
        >
          📍 Navigate to Pickup
        </button>
      </div>

      {/* Pop-Up Karşılama Tabelası (Get Signage Modal) */}
      {showSignage && (
        <div 
          onClick={() => setShowSignage(false)}
          className="fixed inset-0 bg-black flex flex-col justify-center items-center text-white p-6 z-50 text-center cursor-pointer"
        >
          <span className="text-sm tracking-widest text-gray-400 mb-4">WELCOME</span>
          <h1 className="text-5xl font-black uppercase text-yellow-400 tracking-wide">
            {tripData?.passengerName || "ED BUTERA"}
          </h1>
          <p className="text-xs text-gray-500 mt-8">(Kapatmak için ekrana dokunun)</p>
        </div>
      )}
    </div>
  );
}
