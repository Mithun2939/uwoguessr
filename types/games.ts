export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  image_url: string;
  description?: string;
}

export interface Guess {
  latitude: number;
  longitude: number;
  distance: number;
  score: number;
}

export interface GameState {
  currentLocation: Location | null;
  userGuess: Guess | null;
  showResult: boolean;
  totalScore: number;
  currentRound: number;
  maxRounds: number;
  gameCompleted: boolean;
}