import { Sneaker, CartItem, Article } from './types';

// API request client helper
const apiRequest = async (path: string, options?: RequestInit) => {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
  }

  return response.json();
};

export const api = {
  // 1. Get sneaker catalog
  getSneakers: async (): Promise<Sneaker[]> => {
    return apiRequest('/api/sneakers');
  },

  // 2. Authentication Login
  login: async (email: string, password: string) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // 3. Authentication Signup
  signup: async (email: string, password: string, username: string) => {
    return apiRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    });
  },

  // 4. Get profile data
  getProfile: async (userId: number) => {
    return apiRequest(`/api/profile?userId=${userId}`);
  },

  // 5. Update profile data
  updateProfile: async (profileData: {
    userId: number;
    username?: string;
    calories_burned?: number;
    play_time_hours?: number;
    shipping_address_name?: string;
    shipping_address_detail?: string;
    payment_method_visa?: string;
  }) => {
    return apiRequest('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // 6. Get Saved Sneakers
  getSaved: async (userId: number): Promise<Sneaker[]> => {
    return apiRequest(`/api/saved?userId=${userId}`);
  },

  // 7. Toggle Saved Sneaker
  toggleSaved: async (userId: number, sneakerId: string): Promise<{ saved: boolean }> => {
    return apiRequest('/api/saved', {
      method: 'POST',
      body: JSON.stringify({ userId, sneakerId }),
    });
  },

  // 8. Get Cart items
  getCart: async (userId: number): Promise<CartItem[]> => {
    return apiRequest(`/api/cart?userId=${userId}`);
  },

  // 9. Sync Cart items
  syncCart: async (userId: number, cart: CartItem[]): Promise<{ success: boolean }> => {
    return apiRequest('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ userId, cart }),
    });
  },

  // 10. Create new sneaker (Admin only)
  createSneaker: async (sneakerData: {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    badge?: string;
    color: string;
    sizes: number[];
    gallery: string[];
  }): Promise<{ success: boolean }> => {
    return apiRequest('/api/sneakers', {
      method: 'POST',
      body: JSON.stringify(sneakerData),
    });
  },

  // 11. Delete sneaker (Admin only)
  deleteSneaker: async (id: string): Promise<{ success: boolean }> => {
    return apiRequest(`/api/sneakers/${id}`, {
      method: 'DELETE',
    });
  },

  // 12. Get Admin dashboard overview stats
  getAdminStats: async (): Promise<{
    sneakers: number;
    users: number;
    cartItems: number;
    savedPairs: number;
    articles: number;
  }> => {
    return apiRequest('/api/admin/stats');
  },

  // 13. Get all registered users (Admin only)
  getAdminUsers: async (): Promise<any[]> => {
    return apiRequest('/api/admin/users');
  },

  // 14. Get All Articles
  getArticles: async (): Promise<Article[]> => {
    return apiRequest('/api/articles');
  },

  // 15. Get Single Article Details
  getArticle: async (id: number): Promise<Article> => {
    return apiRequest(`/api/articles/${id}`);
  },

  // 16. Create New Article (Admin only)
  createArticle: async (articleData: {
    title: string;
    content: string;
    image: string;
    category: string;
    author: string;
  }): Promise<{ success: boolean }> => {
    return apiRequest('/api/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  },

  // 17. Delete Article (Admin only)
  deleteArticle: async (id: number): Promise<{ success: boolean }> => {
    return apiRequest(`/api/articles/${id}`, {
      method: 'DELETE',
    });
  },

  // 18. Create Midtrans Transaction Snap Token
  createPaymentToken: async (
    userId: number,
    totalAmount: number
  ): Promise<{ token: string; redirect_url: string; isMock: boolean; orderId: string }> => {
    return apiRequest('/api/payment/checkout', {
      method: 'POST',
      body: JSON.stringify({ userId, totalAmount }),
    });
  },

  // 19. Confirm Payment Success
  confirmPaymentSuccess: async (orderId: string, userId: number): Promise<{ success: boolean }> => {
    return apiRequest('/api/payment/success', {
      method: 'POST',
      body: JSON.stringify({ orderId, userId }),
    });
  },

  // 20. Get User Orders list
  getUserOrders: async (userId: number): Promise<any[]> => {
    return apiRequest(`/api/profile/orders?userId=${userId}`);
  },

  // 21. Get Admin Orders list
  getAdminOrders: async (): Promise<any[]> => {
    return apiRequest('/api/admin/orders');
  },

  // 22. Update Order Status (Admin)
  updateOrderStatus: async (orderId: string, status: string): Promise<{ success: boolean }> => {
    return apiRequest(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // 23. Delete Order (Admin)
  deleteOrder: async (orderId: string): Promise<{ success: boolean }> => {
    return apiRequest(`/api/admin/orders/${orderId}`, {
      method: 'DELETE',
    });
  },

  // 24. Update User Role (Admin)
  updateUserRole: async (userId: number, role: string): Promise<{ success: boolean }> => {
    return apiRequest(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  // 25. Delete User (Admin)
  deleteUser: async (userId: number): Promise<{ success: boolean }> => {
    return apiRequest(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },
};
