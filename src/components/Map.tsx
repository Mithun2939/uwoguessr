import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Location } from '../types/database'

const LINE_ANIMATION_MS = 700
const FIT_PADDING: [number, number] = [50, 50]

// Fix for default markers not showing in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom marker icons
const guessIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const correctIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface MapComponentProps {
  center: [number, number]
  zoom?: number
  onMapClick?: (lat: number, lng: number) => void
  guessLocation?: { lat: number; lng: number } | null
  actualLocation?: Location | null
  showResult?: boolean
  disabled?: boolean
}

// Map click handler component
function MapClickHandler({ onMapClick, disabled }: { onMapClick: (lat: number, lng: number) => void; disabled: boolean }) {
  useMapEvents({
    click: (e) => {
      if (!disabled) {
        onMapClick(e.latlng.lat, e.latlng.lng)
      }
    },
  })
  return null
}

// Zoom/fit to show both pins when showing result; reset view when going back to guess mode
function MapViewFit({
  showResult,
  guessLocation,
  actualLocation,
  center,
  zoom,
}: {
  showResult: boolean
  guessLocation: { lat: number; lng: number } | null
  actualLocation: Location | null
  center: [number, number]
  zoom: number
}) {
  const map = useMap()
  const prevShowResult = useRef(showResult)

  useEffect(() => {
    if (showResult && guessLocation && actualLocation) {
      const bounds = L.latLngBounds(
        [guessLocation.lat, guessLocation.lng],
        [actualLocation.latitude, actualLocation.longitude]
      )
      map.fitBounds(bounds, { padding: FIT_PADDING, maxZoom: 15 })
    }
  }, [showResult, guessLocation, actualLocation, map])

  useEffect(() => {
    if (prevShowResult.current && !showResult) {
      map.setView(center, zoom)
    }
    prevShowResult.current = showResult
  }, [showResult, center, zoom, map])

  return null
}

export const MapComponent: React.FC<MapComponentProps> = ({
  center,
  zoom = 15,
  onMapClick,
  guessLocation,
  actualLocation,
  showResult = false,
  disabled = false
}) => {
  const [lineProgress, setLineProgress] = useState(0)

  // Animate dotted line from guess toward actual when showing result
  useEffect(() => {
    if (!showResult || !guessLocation || !actualLocation) {
      setLineProgress(0)
      return
    }
    const start = performance.now()
    let rafId: number
    const tick = (now: number) => {
      const t = Math.min((now - start) / LINE_ANIMATION_MS, 1)
      setLineProgress(t)
      if (t < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [showResult, guessLocation, actualLocation])

  const showLine = showResult && guessLocation && actualLocation
  const endLat = showLine
    ? guessLocation.lat + (actualLocation.latitude - guessLocation.lat) * lineProgress
    : guessLocation?.lat ?? 0
  const endLng = showLine
    ? guessLocation.lng + (actualLocation.longitude - guessLocation.lng) * lineProgress
    : guessLocation?.lng ?? 0

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapViewFit
        showResult={showResult}
        guessLocation={guessLocation ?? null}
        actualLocation={actualLocation ?? null}
        center={center}
        zoom={zoom}
      />
      {onMapClick && <MapClickHandler onMapClick={onMapClick} disabled={disabled || showResult} />}
      
      {guessLocation && (
        <Marker position={[guessLocation.lat, guessLocation.lng]} icon={guessIcon}>
          <Popup>Your Guess</Popup>
        </Marker>
      )}
      
      {showResult && actualLocation && (
        <Marker position={[actualLocation.latitude, actualLocation.longitude]} icon={correctIcon}>
          <Popup>{actualLocation.name}</Popup>
        </Marker>
      )}

      {/* Animated dotted line from guess to actual */}
      {showLine && (
        <Polyline
          positions={[
            [guessLocation.lat, guessLocation.lng],
            [endLat, endLng],
          ]}
          pathOptions={{
            color: '#6b21a8',
            weight: 3,
            opacity: 0.9,
            dashArray: '8, 10',
          }}
        />
      )}
    </MapContainer>
  )
}
