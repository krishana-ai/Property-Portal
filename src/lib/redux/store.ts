import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/ui-slice";
import authReducer from "./slices/auth-slice";
import notificationsReducer from "./slices/notifications-slice";
import propertiesReducer from "./slices/properties-slice";
import listingsReducer from "./slices/listings-slice";
import usersReducer from "./slices/users-slice";
import projectsReducer from "./slices/projects-slice";
import reraReducer from "./slices/rera-slice";
import documentsReducer from "./slices/documents-slice";
import townshipsReducer from "./slices/townships-slice";

export const makeStore = () =>
  configureStore({
    reducer: {
      ui: uiReducer,
      auth: authReducer,
      notifications: notificationsReducer,
      properties: propertiesReducer,
      listings: listingsReducer,
      users: usersReducer,
      projects: projectsReducer,
      rera: reraReducer,
      documents: documentsReducer,
      townships: townshipsReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
