export interface CartItem {
  id: number;
  name: string;
  price: number; // Assuming price is a number
  quantity: number;
  user_id: number; // Assuming user_id is a number
  imageUrl: string;
  available: boolean; // Ensure available is included here
  likes: number;
}
