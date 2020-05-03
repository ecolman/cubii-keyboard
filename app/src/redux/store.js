import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { createHashHistory } from "history";
import rootReducer from "./index";

export const history = createHashHistory();

const store = configureStore({
  reducer: rootReducer(history),
  middleware: [...getDefaultMiddleware({
    serializableCheck: false
  })]
});

export default store;
