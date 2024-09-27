// app/providers/ReduxProvider.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "../../../libs/redux/store";
export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
