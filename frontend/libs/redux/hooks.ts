import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>(); // Hook pour dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // Hook pour accéder à l'état
