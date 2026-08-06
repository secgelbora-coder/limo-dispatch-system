// Sürücüyü cihaza göre Apple Maps, Google Maps veya Waze'e yönlendiren modül

export function openNavigation(latitude, longitude, address) {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const encodedAddress = encodeURIComponent(address);

  // iOS / Apple Cihaz Kontrolü
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    // Doğrudan Apple Maps Uygulamasını Aç
    window.location.href = `maps://maps.apple.com/?daddr=${latitude},${longitude}&q=${encodedAddress}`;
  } else {
    // Android / Masaüstü için Google Maps Aç
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
  }
}
