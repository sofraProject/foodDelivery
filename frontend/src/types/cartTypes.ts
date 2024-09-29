// types/cartTypes.ts
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  available: boolean;
  likes: number;
  restaurantId: string | number;
}
