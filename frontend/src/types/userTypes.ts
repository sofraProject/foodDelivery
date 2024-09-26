export interface User {
  photoURL: string;
  name: string;
  id: number;
  email: string;
  role: string;
  imageUrl: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
}
