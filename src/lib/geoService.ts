/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Geolocation & Proximity Mapping Service for Bussinest B2B Marketplace
 */

import { useState, useEffect, useCallback } from "react";

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface UserLocationState {
  coords: GeoCoordinates | null;
  cityName: string;
  stateName: string;
  country: string;
  isLive: boolean;
  loading: boolean;
  error: string | null;
  accuracyMeters?: number;
}

export interface HubLocation {
  name: string;
  displayName: string;
  state: string;
  coords: GeoCoordinates;
  industrialFocus: string;
}

// Major Manufacturing & Wholesale Industrial Hubs across India
export const KNOWN_INDUSTRIAL_HUBS: Record<string, HubLocation> = {
  "pune": {
    name: "Pune",
    displayName: "Pune & Pimpri-Chinchwad Hub",
    state: "Maharashtra",
    coords: { lat: 18.5204, lng: 73.8567 },
    industrialFocus: "Auto Ancillaries, Forging, CNC & Heavy Engineering"
  },
  "mumbai": {
    name: "Mumbai",
    displayName: "Mumbai & MMR / Thane Belt",
    state: "Maharashtra",
    coords: { lat: 19.0760, lng: 72.8777 },
    industrialFocus: "Chemicals, Textiles, Port Logistics & Metal Trading"
  },
  "ahmedabad": {
    name: "Ahmedabad",
    displayName: "Ahmedabad & Sanand GIDC",
    state: "Gujarat",
    coords: { lat: 23.0225, lng: 72.5714 },
    industrialFocus: "Machinery, Heavy Pumps, Pharma APIs & Solar PV"
  },
  "surat": {
    name: "Surat",
    displayName: "Surat & Hazira Industrial Belt",
    state: "Gujarat",
    coords: { lat: 21.1702, lng: 72.8311 },
    industrialFocus: "Textile Mills, Corrugated Packaging & Polymers"
  },
  "delhi": {
    name: "Delhi NCR",
    displayName: "Delhi NCR (Gurgaon / Noida / Okhla)",
    state: "Delhi NCR",
    coords: { lat: 28.6139, lng: 77.2090 },
    industrialFocus: "Electronics, Precision Hardware & Cold Storage"
  },
  "bengaluru": {
    name: "Bengaluru",
    displayName: "Bengaluru & Peenya Industrial Zone",
    state: "Karnataka",
    coords: { lat: 12.9716, lng: 77.5946 },
    industrialFocus: "Aerospace Machining, CNC Automation & Tech Hardware"
  },
  "chennai": {
    name: "Chennai",
    displayName: "Chennai & Sriperumbudur Cluster",
    state: "Tamil Nadu",
    coords: { lat: 13.0827, lng: 80.2707 },
    industrialFocus: "Heavy Fabrication, Auto Components & Port Freight"
  },
  "hyderabad": {
    name: "Hyderabad",
    displayName: "Hyderabad & Genome Valley",
    state: "Telangana",
    coords: { lat: 17.3850, lng: 78.4867 },
    industrialFocus: "Pharma Active Ingredients, Solar & Electricals"
  },
  "coimbatore": {
    name: "Coimbatore",
    displayName: "Coimbatore Foundry & Pump Corridor",
    state: "Tamil Nadu",
    coords: { lat: 11.0168, lng: 76.9558 },
    industrialFocus: "Foundries, Motors, Pumps & Textile Machining"
  },
  "ludhiana": {
    name: "Ludhiana",
    displayName: "Ludhiana & Mandi Gobindgarh",
    state: "Punjab",
    coords: { lat: 30.9010, lng: 75.8573 },
    industrialFocus: "TMT Steel Rolling, Fasteners & Bicycle Alloys"
  },
  "rajkot": {
    name: "Rajkot",
    displayName: "Rajkot Aji GIDC & Shapar",
    state: "Gujarat",
    coords: { lat: 22.3039, lng: 70.8022 },
    industrialFocus: "CNC Lathes, Diesel Engines & Bearings"
  },
  "kolkata": {
    name: "Kolkata",
    displayName: "Kolkata & Howrah Metals Corridor",
    state: "West Bengal",
    coords: { lat: 22.5726, lng: 88.3639 },
    industrialFocus: "Mining Equipment, Castings & Jute Packaging"
  },
  "jaipur": {
    name: "Jaipur",
    displayName: "Jaipur & Sitapura Industrial Area",
    state: "Rajasthan",
    coords: { lat: 26.9124, lng: 75.7873 },
    industrialFocus: "Minerals, Ceramic Tiles & Handicraft Export"
  },
  "indore": {
    name: "Indore",
    displayName: "Indore & Pithampur Auto Special Zone",
    state: "Madhya Pradesh",
    coords: { lat: 22.7196, lng: 75.8577 },
    industrialFocus: "Pharma Formulations, Auto Assembly & Soy Processing"
  },
  "vadodara": {
    name: "Vadodara",
    displayName: "Vadodara & Manjusar GIDC",
    state: "Gujarat",
    coords: { lat: 22.3072, lng: 73.1812 },
    industrialFocus: "Switchgears, Power Transmission & Petrochemicals"
  }
};

/**
 * Calculates straight-line distance in Kilometers between two coordinates using the Haversine formula
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const directDistance = R * c;
  
  // Apply realistic road curvature multiplier (~1.2x) for highway logistics routing
  const roadDistance = directDistance * 1.18;
  return Math.round(roadDistance * 10) / 10;
}

/**
 * Estimates supplier delivery dispatch SLA based on road distance
 */
export function getDispatchEstimate(distanceKm: number): {
  transitTime: string;
  dispatchBadge: string;
  isSameDay: boolean;
  transitHours: number;
} {
  if (distanceKm <= 20) {
    return {
      transitTime: "Same-Day Direct Delivery (2–4 hrs)",
      dispatchBadge: "Local Hub (Same-Day)",
      isSameDay: true,
      transitHours: 3
    };
  }
  if (distanceKm <= 75) {
    return {
      transitTime: "Express Direct Freight (4–8 hrs)",
      dispatchBadge: "Metro Corridor",
      isSameDay: true,
      transitHours: 6
    };
  }
  if (distanceKm <= 250) {
    return {
      transitTime: "Next-Day Scheduled Delivery (12–24 hrs)",
      dispatchBadge: "Regional Cluster",
      isSameDay: false,
      transitHours: 18
    };
  }
  if (distanceKm <= 700) {
    return {
      transitTime: "1–2 Business Days Direct FTL",
      dispatchBadge: "Interstate Transit",
      isSameDay: false,
      transitHours: 36
    };
  }
  return {
    transitTime: "2–3 Days Pan-India Secured Freight",
    dispatchBadge: "Pan-India Dedicated",
    isSameDay: false,
    transitHours: 60
  };
}

/**
 * Resolves coordinates for a vendor based on location string or falls back to known Indian hubs
 */
export function resolveCoordinatesForLocation(locationStr: string): GeoCoordinates {
  if (!locationStr) return KNOWN_INDUSTRIAL_HUBS["mumbai"].coords;

  const lower = locationStr.toLowerCase();
  
  for (const [key, hub] of Object.entries(KNOWN_INDUSTRIAL_HUBS)) {
    if (lower.includes(key) || lower.includes(hub.name.toLowerCase())) {
      // Add slight deterministic jitter so multiple vendors in same city don't completely overlap on map
      const charCodeSum = locationStr.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const jitterLat = ((charCodeSum % 10) - 5) * 0.008;
      const jitterLng = (((charCodeSum * 3) % 10) - 5) * 0.008;
      return {
        lat: hub.coords.lat + jitterLat,
        lng: hub.coords.lng + jitterLng
      };
    }
  }

  // Default fallback to central coordinates
  return { lat: 18.5204 + Math.random() * 0.05, lng: 73.8567 + Math.random() * 0.05 };
}

/**
 * Reverse geocodes coordinates to city/region with fallback to nearest industrial hub
 */
export async function reverseGeocodeLiveCoords(coords: GeoCoordinates): Promise<{
  city: string;
  state: string;
  country: string;
  formatted: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}&zoom=10`,
      {
        signal: controller.signal,
        headers: {
          "Accept-Language": "en",
          "User-Agent": "BussinestB2BMarketplace/1.0"
        }
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.municipality || addr.district || addr.county || "Local Area";
      const state = addr.state || "";
      const country = addr.country || "India";

      return {
        city,
        state,
        country,
        formatted: `${city}${state ? `, ${state}` : ""}`
      };
    }
  } catch (e) {
    // Network or timeout failure, resolve to closest known hub
  }

  // Find closest known industrial hub
  let closestHub = KNOWN_INDUSTRIAL_HUBS["pune"];
  let minDistance = Infinity;

  for (const hub of Object.values(KNOWN_INDUSTRIAL_HUBS)) {
    const dist = calculateHaversineDistanceKm(coords.lat, coords.lng, hub.coords.lat, hub.coords.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestHub = hub;
    }
  }

  return {
    city: closestHub.name,
    state: closestHub.state,
    country: "India",
    formatted: `${closestHub.name}, ${closestHub.state}`
  };
}

// Module-level tracker to avoid redundant simultaneous browser permission prompts
let isAutoRequesting = false;
let hasAttemptedAutoLocation = false;

/**
 * Custom React Hook for live geolocation detection with automatic permission request on page entry,
 * cross-component real-time event synchronization, local caching, and seamless fallback.
 */
export function useLiveLocation() {
  const [locationState, setLocationState] = useState<UserLocationState>(() => {
    // Check if previously saved in session or local storage
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("bussinest_user_location") || localStorage.getItem("bussinest_user_location");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    // Default fallback to Pune / Mumbai industrial cluster
    return {
      coords: { lat: 18.5204, lng: 73.8567 },
      cityName: "Pune",
      stateName: "Maharashtra",
      country: "India",
      isLive: false,
      loading: false,
      error: null
    };
  });

  // Request browser live GPS
  const detectLiveLocation = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationState(prev => ({
        ...prev,
        error: "Geolocation is not supported by your browser.",
        loading: false
      }));
      return;
    }

    setLocationState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords: GeoCoordinates = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };

        const geoInfo = await reverseGeocodeLiveCoords(coords);

        const newState: UserLocationState = {
          coords,
          cityName: geoInfo.city,
          stateName: geoInfo.state,
          country: geoInfo.country,
          isLive: true,
          loading: false,
          error: null,
          accuracyMeters: Math.round(pos.coords.accuracy)
        };

        setLocationState(newState);
        try {
          sessionStorage.setItem("bussinest_user_location", JSON.stringify(newState));
          localStorage.setItem("bussinest_user_location", JSON.stringify(newState));
        } catch (e) {}

        // Broadcast to all other active components on the page
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("bussinest_location_updated", { detail: newState }));
        }
      },
      async (err) => {
        console.warn("Geolocation permission prompt dismissed, denied, or timed out:", err.message);

        // Fallback: Attempt IP-based location so user gets their city automatically even if GPS permission is denied
        try {
          const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
          if (res.ok) {
            const data = await res.json();
            if (data && data.city && data.latitude && data.longitude) {
              const ipCoords: GeoCoordinates = { lat: Number(data.latitude), lng: Number(data.longitude) };
              const ipState: UserLocationState = {
                coords: ipCoords,
                cityName: data.city,
                stateName: data.region || "Maharashtra",
                country: data.country_name || "India",
                isLive: false,
                loading: false,
                error: null
              };

              setLocationState(ipState);
              try {
                sessionStorage.setItem("bussinest_user_location", JSON.stringify(ipState));
              } catch (e) {}

              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("bussinest_location_updated", { detail: ipState }));
              }
              return;
            }
          }
        } catch (ipErr) {
          // IP fallback silent
        }

        // Final graceful fallback to default industrial hub (Pune / Mumbai)
        setLocationState(prev => ({
          ...prev,
          loading: false,
          error: "Location access denied or unavailable. Using default industrial hub."
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, []);

  // Automatically request permission and detect location as soon as user enters the page
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Cross-component sync
    const handleLocationSync = (e: any) => {
      if (e.detail) {
        setLocationState(e.detail);
      }
    };
    window.addEventListener("bussinest_location_updated", handleLocationSync);

    // Auto-prompt on page entry if not already attempted or live
    if (!hasAttemptedAutoLocation && !isAutoRequesting) {
      hasAttemptedAutoLocation = true;
      isAutoRequesting = true;

      // Small tick to ensure page DOM has loaded smoothly
      const timer = setTimeout(() => {
        detectLiveLocation();
        isAutoRequesting = false;
      }, 300);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("bussinest_location_updated", handleLocationSync);
      };
    }

    return () => {
      window.removeEventListener("bussinest_location_updated", handleLocationSync);
    };
  }, [detectLiveLocation]);

  // Set manual hub selection
  const setManualHub = useCallback((hubKey: string) => {
    const hub = KNOWN_INDUSTRIAL_HUBS[hubKey.toLowerCase()] || KNOWN_INDUSTRIAL_HUBS["pune"];
    const newState: UserLocationState = {
      coords: hub.coords,
      cityName: hub.name,
      stateName: hub.state,
      country: "India",
      isLive: false,
      loading: false,
      error: null
    };
    setLocationState(newState);
    try {
      sessionStorage.setItem("bussinest_user_location", JSON.stringify(newState));
      localStorage.setItem("bussinest_user_location", JSON.stringify(newState));
    } catch (e) {}

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("bussinest_location_updated", { detail: newState }));
    }
  }, []);

  return {
    ...locationState,
    detectLiveLocation,
    setManualHub
  };
}
