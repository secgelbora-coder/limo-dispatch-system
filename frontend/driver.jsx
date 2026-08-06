import DriverView from './DriverView';

export default function DriverPage() {
  // Örnek canlı veri şablonu
  const sampleTrip = {
    tripId: "00001",
    companyName: "Blue Printell",
    passengerName: "Hakan Alp",
    passengerPhone: "(561) 601-8721",
    passengerCount: 1,
    pickupAddress: "1041 NW 2nd Ave, Fort Lauderdale, FL 33311",
    dropoffAddress: "FLL - Fort Lauderdale-Hollywood International Airport",
    pickupTime: "9:30 AM",
    dropoffTime: "10:30 AM",
    flightCode: "1755",
    status: "On The Way"
  };

  return <DriverView tripData={sampleTrip} />;
}
