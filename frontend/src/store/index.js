// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import residentReducer from "./slices/residentSlice";
import authReducer from "./slices/authSlice";
import guardReducer from "./slices/guardSlice";
import visitorReducer from "./slices/visitorSlice";
import complaintReducer from './slices/complaintSlice'
import facilityReducer from './slices/facilitySlice'
import bookingReducer from './slices/facilityBookingSlice'
import maintenanceReducer from './slices/maintenanceSlice'

export const store = configureStore({
  reducer: {
    resident: residentReducer,
    auth: authReducer,
    guard: guardReducer,
    visitor: visitorReducer,
    complaint: complaintReducer,
    facility: facilityReducer, 
    booking:bookingReducer,
    maintenance: maintenanceReducer,
  },
});

export default store;