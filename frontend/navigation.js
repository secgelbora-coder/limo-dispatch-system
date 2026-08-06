/**
 * Navigation Module
 * Redirects drivers to Apple Maps, Google Maps, or Waze based on platform/preference.
 */

export const NAV_CONFIG = {
  company: "Blueprintel",
  defaultDestination: "1041 NW 2nd Ave, Fort Lauderdale, FL 33311",
  dispatchPhone: "561-601-8721"
};

export const openMapNavigation = (destinationAddress = NAV_CONFIG.defaultDestination, provider = 'google') => {
  const encodedAddress = encodeURIComponent(destinationAddress);
  let url = '';

  switch (provider) {
    case 'apple':
      url = `maps://maps.apple.com/?daddr=${encodedAddress}`;
      break;
    case 'waze':
      url = `https://waze.com/ul?q=${encodedAddress}&navigate=yes`;
      break;
    case 'google':
    default:
      url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
      break;
  }

  window.open(url, '_blank');
};
