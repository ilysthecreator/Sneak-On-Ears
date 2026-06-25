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

export interface User {
  id: number;
  email: string;
  username: string;
  role: 'customer' | 'admin';
}

export interface Article {
  id: number;
  title: string;
  content: string;
  image: string;
  category: string;
  author: string;
  created_at: string;
}

export const formatIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

