import { AppDispatch } from "../redux/store"; // Assurez-vous que le chemin est correct
import { addToCart } from "../redux/features/cartSlice"; // Assurez-vous que le chemin est correct
import swal from "sweetalert";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  available: boolean;
  likes: number;
  restaurantId?: number;
}

export const handleAddToCartHelper = (
  item: CartItem,
  dispatch: AppDispatch
) => {
  dispatch(
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
      available: item.available,
      likes: item.likes,
      restaurantId: item.restaurantId, // Ajoutez cet attribut si nécessaire
    })
  );
  swal("Delicious choice!", "Your order has been added to the cart", "success");
};
