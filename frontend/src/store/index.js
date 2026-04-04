import { configureStore } from "@reduxjs/toolkit";
import residentReducer      from "./slices/residentSlice";
import authReducer          from "./slices/authSlice";
import guardReducer         from "./slices/guardSlice";
import visitorReducer       from "./slices/visitorSlice";
import complaintReducer      from "./slices/complaintSlice";
import facilityReducer       from "./slices/facilitySlice";
import bookingReducer        from "./slices/facilityBookingSlice"; 
import maintenanceReducer    from "./slices/maintainenceSlice";
import expenseReducer        from "./slices/expenseSlice";
import noticeReducer         from "./slices/noticeSlice";
import eventReducer          from "./slices/eventSlice";
import flatReducer           from './slices/flatSlice';
import pollReducer           from './slices/pollSlice';
import alertReducer          from './slices/alertSlice';
import maintenanceBillingReducer from "./slices/Maintenancebillingslice";
import paymentReducer        from "./slices/paymentSlice";

export const store = configureStore({
  reducer: {
    resident:    residentReducer,
    auth:        authReducer,
    guard:       guardReducer,
    visitor:     visitorReducer,
    complaint:   complaintReducer,
    maintenance: maintenanceReducer,
    expense:     expenseReducer,
    notice:      noticeReducer,
    event:       eventReducer,
    flat:        flatReducer,
    booking:     bookingReducer, 
    facility:    facilityReducer,
    poll:        pollReducer,  
    alert:       alertReducer, 
    maintenanceBilling: maintenanceBillingReducer,
    payment: paymentReducer,
  },
});

export default store;