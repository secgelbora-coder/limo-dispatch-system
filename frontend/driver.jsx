import DriverView from './DriverView';

export default function DriverPage() {
  // Örnek canlı veri şablonu
  const sampleTrip = {
    tripId: "41711",
    companyName: "SLADE SERVICES",
    passengerName: "Ed Butera",
    passengerPhone: "(561) 706-1976",
    passengerCount: 1,
    pickupAddress: "1050 NW 1st Ave Boca Raton FL 33432",
    dropoffAddress: "FLL - Fort Lauderdale-Hollywood International Airport",
    pickupTime: "9:30 AM",
    dropoffTime: "10:30 AM",
    flightCode: "1755",
    status: "On The Way"
  };

  return <DriverView tripData={sampleTrip} />;
}
