import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Location } from '../types/database'

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

export const MapComponent: React.FC<MapComponentProps> = ({
  center,
  zoom = 15,
  onMapClick,
  guessLocation,
  actualLocation,
  showResult = false,
  disabled = false
}) => {
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

      {/* Dotted line from guess to actual (MacGuessr-style) */}
      {showResult && guessLocation && actualLocation && (
        <Polyline
          positions={[
            [guessLocation.lat, guessLocation.lng],
            [actualLocation.latitude, actualLocation.longitude],
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
