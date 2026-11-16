// Distância máxima que faz sentido caminhar até um ponto de ônibus
export const MAX_WALK_METERS = 800;

// Distância em metros entre duas coordenadas (fórmula de Haversine)
export const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Encontra a parada mais próxima do usuário.
export const getClosestStop = (stops, coords) => {
  if (!coords || !Array.isArray(stops)) return null;

  let closest = null;
  let minDistance = Infinity;

  for (const stop of stops) {
    if (!stop?.py || !stop?.px) continue;

    const dist = getDistanceInMeters(
      coords.latitude,
      coords.longitude,
      stop.py,
      stop.px,
    );

    if (dist < minDistance) {
      minDistance = dist;
      closest = stop;
    }
  }

  return closest ? { stop: closest, distance: Math.round(minDistance) } : null;
};
