import { useState } from 'react'
import { Upload, MapPin, CheckCircle } from 'lucide-react'
import { submitLocation } from '../services/submissionService'
import { MapComponent } from '../components/Map'

const WESTERN_CENTER: [number, number] = [43.0096, -81.2737]

export const Contribute: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleMapClick = (lat: number, lng: number) => {
    setLocation({ lat, lng })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file || !location || !name.trim()) {
      alert('Please fill in all required fields and select a location on the map.')
      return
    }

    setSubmitting(true)
    
    try {
      await submitLocation(
        file,
        location.lat,
        location.lng,
        name.trim(),
        description.trim() || undefined
      )
      setSubmitted(true)
      setFile(null)
      setPreview(null)
      setName('')
      setDescription('')
      setLocation(null)
    } catch (err) {
      console.error('Error submitting:', err)
      alert(err instanceof Error ? err.message : 'An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl shadow-slate-200/50 max-w-md w-full text-center border border-slate-100">
          <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
          <h2 className="text-3xl font-bold mb-4 text-slate-800">Thank You!</h2>
          <p className="text-slate-600 mb-6">
            Your submission has been received and will be reviewed before being added to the game.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-purple-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-800 hover:shadow-xl hover:shadow-purple-900/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-purple-900/20"
          >
            Submit Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <Upload className="text-purple-900" size={36} />
          Contribute a Location
        </h2>

        <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60 hover:border-purple-100">
          <p className="text-slate-600 mb-6">
            Upload a campus photo, drop a pin on the map for <strong>latitude & longitude</strong>, and add a name. 
            After you submit, it gets reviewed—then your image and coordinates go into the game.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Image upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. Your photo *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {preview ? (
                  <div className="space-y-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null)
                        setPreview(null)
                      }}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                    <label className="cursor-pointer">
                      <span className="text-purple-900 font-medium">Click to upload</span>
                      <span className="text-gray-600"> or drag and drop</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG. Compressed automatically.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Map - sets latitude & longitude */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. Where was it taken? * <span className="text-gray-500 font-normal">(click the map to set latitude & longitude)</span>
              </label>
              <p className="text-sm text-gray-600 mb-2">
                Click the exact spot on the map. That pin sets the <strong>latitude and longitude</strong> used in the game.
              </p>
              <div className="w-full h-96 rounded-lg overflow-hidden border-2 border-gray-300">
                <MapComponent
                  center={WESTERN_CENTER}
                  zoom={15}
                  onMapClick={handleMapClick}
                  guessLocation={location ? { lat: location.lat, lng: location.lng } : null}
                  disabled={false}
                />
              </div>
              {location ? (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <MapPin size={16} />
                  Coordinates set: lat <strong>{location.lat.toFixed(6)}</strong>, lng <strong>{location.lng.toFixed(6)}</strong>
                </p>
              ) : (
                <p className="text-sm text-amber-600 mt-2">Click the map to set coordinates.</p>
              )}
            </div>

            {/* 3. Location name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3. Location name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., UC Courtyard, Weldon Library entrance"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200"
                required
              />
            </div>

            {/* 4. Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                4. Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Main lawn in front of the building"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!file || !location || !name.trim() || submitting}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                file && location && name.trim() && !submitting
                  ? 'bg-purple-900 text-white hover:bg-purple-800 hover:shadow-lg hover:shadow-purple-900/20 hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit for Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
