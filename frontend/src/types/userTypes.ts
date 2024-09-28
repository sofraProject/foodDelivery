// types/userTypes.ts

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // Si vous n'en avez pas besoin côté client, laissez-le optionnel
  imagesUrl?: string;
  balance?: number;
  location?: { type: string; coordinates: number[] }; // Assurez-vous que cela correspond à votre structure de données
  role: string; // Ex : "customer", "restaurant_owner", "driver"
}

export interface UserResponse {
  user: User; // Pour le typage de la réponse d'API
  token: string; // Pour stocker le token JWT
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
  role: string;
}


