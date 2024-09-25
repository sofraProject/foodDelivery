"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "../../libs/redux/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef(makeStore());

  return <Provider store={storeRef.current}>{children}</Provider>;
}
