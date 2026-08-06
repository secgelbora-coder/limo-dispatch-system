import React, { useState } from 'react';

export default function DispatchDashboard() {
  const [trips, setTrips] = useState([
    {
      id: "41711",
      passengerName: "Bora Secgel",
      passengerPhone: "(561) 601-8721",
      pickup: "1041 nw 2nd ave FortLauderdale, FL",
      dropoff: "FLL Airport",
      driver: "Hakan Alp",
      status: "On The Way",
      assignedAffiliate: "KU23N",
      lastGps: "26.358, -80.083"
    }
  ]);

  const [newTrip, setNewTrip] = useState({
    passengerName: '',
    passengerPhone: '',
    pickup: '',
    dropoff: '',
    flightCode: ''
  });

  // Sürücüye veya Affiliate Şirkete Otomatik SMS Atma Fonksiyonu
  const sendDriverSMS = (tripId, phone) => {
    const generatedToken = Math.random().toString(36).substring(2, 9);
    const link = `https://sladeservices.addons.la/l/?k=${generatedToken}`;
    
    alert(`SMS Başarıyla Gönderildi!\nAlıcı: ${phone}\nLink: ${link}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 font-sans">
      {/* Üst Bar / Header */}
      <div className="flex justify-between items-center pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">Limo Dispatch & Affiliate Control</h1>
          <p className="text-xs text-slate-400">Canlı Sürüş ve Transfer Yönetim Paneli</p>
        </div>
        <div className="flex gap-3">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Systems Operational
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Sol Kolon: Yeni Transfer Oluşturma Formu */}
        <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700/50">
          <h2 className="text-lg font-semibold mb-4 text-slate-200">Yeni Sürüş (Trip) Ekle</h2>
          <form className="space-y-3 text-sm" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Yolcu Adı Soyadı</label>
              <input type="text" placeholder="Örn: Ed Butera" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Yolcu Telefonu</label>
              <input type="text" placeholder="(561) 000-0000" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Alış Adresi (Pickup)</label>
              <input type="text" placeholder="Adres girin..." className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Bırakış Adresi (Dropoff)</label>
              <input type="text" placeholder="Havalimanı / Otel vb." className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-orange-500" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 text-xs mb-1">Uçuş Kodu</label>
                <input type="text" placeholder="UAL 1755" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Atanacak Affiliate/Sürücü</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-orange-500">
                  <option>Özmal Sürücü</option>
                  <option>Slade Services (Affiliate)</option>
                </select>
              </div>
            </div>
            <button className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-lg mt-4 transition">
              + Transferi Oluştur ve Yayınla
            </button>
          </form>
        </div>

        {/* Sağ Kolon: Aktif Transferler ve Canlı Durum Listesi */}
        <div className="lg:col-span-2 bg-slate-800/60 p-5 rounded-xl border border-slate-700/50">
          <h2 className="text-lg font-semibold mb-4 text-slate-200">Aktif Sürüşler & GPS Takibi</h2>
          <div className="space-y-4">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-300 font-mono">#{trip.id}</span>
                    <h3 className="font-bold text-base">{trip.passengerName}</h3>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">{trip.status}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">📍 {trip.pickup} ➔ {trip.dropoff}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Sürücü/Affiliate: <span className="text-slate-300">{trip.assignedAffiliate}</span> | GPS: <span className="text-orange-400">{trip.lastGps}</span></p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => sendDriverSMS(trip.id, trip.passengerPhone)}
                    className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs px-3 py-2 rounded-lg font-medium transition"
                  >
                    📲 Sürücüye SMS Linki At
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
