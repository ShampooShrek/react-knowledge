import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./features/user/authSlice";
import categorySlice from "./features/categories/categoriesSlice"
import articleSlice from "./features/articles/articleSlice";
import userSlice from "./features/user/userSlice";

export const store = configureStore({
  reducer: { auth: authSlice, users: userSlice, articles: articleSlice, categories: categorySlice },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
