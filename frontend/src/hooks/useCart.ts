import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCartItems } from "../redux/features/cartSlice";
import { AppDispatch, RootState } from "../redux/store";

export const useCart = () => {
  const dispatch: AppDispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

  return { items };
};
