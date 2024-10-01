// types/userTypes.ts

export interface User {
  id?: number;
  name?: string;
  email?: string;
  password?: string; // Si vous n'en avez pas besoin côté client, laissez-le optionnel
  imagesUrl?: string;
  balance?: number;
  location?: { type: string; coordinates: number[] }; // Assurez-vous que cela correspond à votre structure de données
  role?: string; // Ex : "customer", "restaurant_owner", "driver"
}

export interface UserResponse {
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}



// export interface UserResponse {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   imageUrl?: string; // Assuming this exists in your response
// }

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string | null; // Allow null as a valid value
}
