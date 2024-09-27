import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCartItems } from "../redux/features/cartSlice";
import { AppDispatch, RootState } from "../redux/store";

export const useCart = () => {
  const dispatch: AppDispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);

  // Charger les éléments du panier depuis sessionStorage lorsque le composant est monté
  useEffect(() => {
    dispatch(getCartItems()); // Charge les éléments depuis sessionStorage
  }, [dispatch]);

  return { items };
};
