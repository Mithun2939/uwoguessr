export interface Location {
  id: string
  name: string
  latitude: number
  longitude: number
  image_url: string
  description?: string
  created_at: string
  is_active: boolean
  usage_count: number
}

export interface DailyChallenge {
  id: string
  date: string
  location_ids: string[]
  created_at: string
}

export interface LeaderboardEntry {
  id: string
  player_name: string
  score: number
  challenge_date: string
  created_at: string
}

export interface Submission {
  id: string
  image_url: string
  latitude: number
  longitude: number
  name: string
  description?: string
  submitted_by?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface Guess {
  latitude: number
  longitude: number
  distance: number
  score: number
}
