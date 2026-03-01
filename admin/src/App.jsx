import React from "react";
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from "./components/AdminDashboard";
import AdminLayout from "./components/common/AdminLayout";
import Residents from "./components/pages/Residents";
import Guards from './components/pages/Guards';
import Visitors from "./components/pages/Visitors";
import Payments from './components/pages/Payments';
import Complaints from './components/pages/Complaints';

function App() {
  return (
    <Routes>
      {/* Parent Layout Route */}
      <Route path="/" element={<AdminLayout />}>
        
        {/* Default Dashboard view (loads at "/") */}
        <Route index element={<AdminDashboard />} />
        
        {/* Child pages (Notice the paths no longer have the leading "/") */}
        <Route path="residents" element={<Residents />} />
        <Route path="guards" element={<Guards />} />
        <Route path="visitors" element={<Visitors />} />
        <Route path="payments" element={<Payments />} />
        
        {/* Uncomment this once your Expenses component is ready */}
        {/* <Route path="expenses" element={<Expenses />} /> */}
        
        <Route path="complaints" element={<Complaints />} />
      </Route>
    </Routes>
  );
}

export default App;