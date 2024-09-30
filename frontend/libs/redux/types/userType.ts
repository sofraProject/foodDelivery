export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    photoURL: string;
    imageUrl: string;
    location?: {
      type: string;
      coordinates: [number, number];
    };
  }
  