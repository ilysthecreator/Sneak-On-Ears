export interface Sneaker {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  badge?: string;
  bgDecorative?: string;
  gallery: string[];
  sizes: number[];
  color: string;
}

export interface CartItem {
  sneaker: Sneaker;
  size: number;
  quantity: number;
  selectedColor: string;
}

export type ViewMode = 'intro' | 'login' | 'home' | 'detail' | 'cart' | 'scan' | 'profile';

export interface UserStats {
  caloriesBurned: number;
  playTimeHours: number;
}

export interface SavedPair {
  id: string;
  sneaker: Sneaker;
  savedAt: string;
}
