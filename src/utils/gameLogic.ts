import type { Location, Guess } from '../types/database'

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371000 // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

/**
 * Calculate score based on distance
 * Closer guesses get more points (max 5000 points)
 */
export const calculateScore = (distance: number): number => {
  const maxDistance = 500 // 500 meters for campus
  if (distance > maxDistance) return 0
  return Math.round(5000 * (1 - distance / maxDistance))
}

/**
 * Process a guess and return the result
 */
export const processGuess = (
  guessLat: number,
  guessLon: number,
  actualLocation: Location
): Guess => {
  const distance = calculateDistance(
    guessLat,
    guessLon,
    actualLocation.latitude,
    actualLocation.longitude
  )
  const score = calculateScore(distance)
  
  return {
    latitude: guessLat,
    longitude: guessLon,
    distance,
    score
  }
}
