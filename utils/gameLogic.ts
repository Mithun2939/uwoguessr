export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const calculateScore = (distance: number): number => {
  if (distance <= 10) return 5000;
  if (distance <= 50) return 4000;
  if (distance <= 100) return 3000;
  if (distance <= 500) return 2000;
  if (distance <= 1000) return 1000;
  return Math.max(5000 - Math.floor(distance / 10), 100);
};