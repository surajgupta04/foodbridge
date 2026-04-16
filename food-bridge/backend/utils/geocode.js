import fetch from 'node-fetch';

// In-memory cache — address string → { lat, lng }
// Persists as long as the server runs, zero extra dependencies
const geocodeCache = new Map();

export const geocodeAddress = async (address) => {

  // Normalise key — trim + lowercase so "Alkapuri, Vadodara"
  // and "alkapuri,vadodara " both hit the same cache entry
  const cacheKey = address.trim().toLowerCase();

  // Cache hit — return stored result instantly, skip Nominatim entirely
  if (geocodeCache.has(cacheKey)) {
    console.log(`[Geocode CACHE HIT] "${address}" | Cache size: ${geocodeCache.size}`);
    return geocodeCache.get(cacheKey);
  }

  // Cache miss — call Nominatim API
  try {
    console.log(`[Geocode API CALL] "${address}"`);
    const encoded = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'FoodBridge/1.0 (foodbridge@gmail.com)'
      }
    });

    const data = await res.json();

    if (!data || data.length === 0) {
      console.warn(`[Geocode] No result for: ${address}`);
      // Cache null too — so bad addresses don't keep hitting the API
      geocodeCache.set(cacheKey, null);
      return null;
    }

    const coords = {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };

    // Store result — all future calls with this address skip the API
    geocodeCache.set(cacheKey, coords);
    console.log(`[Geocode CACHED] "${address}" → ${coords.lat}, ${coords.lng} | Cache size: ${geocodeCache.size}`);

    return coords;
  } catch (err) {
    console.error('[Geocode] Error:', err.message);
    return null;
  }
};

// Utility — call this anytime to inspect what's cached
// Usage: import { getGeocodeCache } from '../utils/geocode.js'
// Then: console.log(getGeocodeCache())
export const getGeocodeCache = () => ({
  size: geocodeCache.size,
  entries: [...geocodeCache.entries()].map(([address, coords]) => ({ address, coords }))
});