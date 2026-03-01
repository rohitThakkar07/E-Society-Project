import React from "react";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
    
      {/* MAIN CONTENT AREA */}
      <div className="flex-1">

        {/* HEADER */}
       

        {/* DASHBOARD CONTENT */}
        <main className="p-6">
          
          {/* CARDS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Total Residents</p>
              <h2 className="text-2xl font-bold mt-2">120</h2>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Visitors Today</p>
              <h2 className="text-2xl font-bold mt-2">34</h2>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Pending Complaints</p>
              <h2 className="text-2xl font-bold mt-2 text-red-600">8</h2>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Monthly Collection</p>
              <h2 className="text-2xl font-bold mt-2 text-green-600">₹2,50,000</h2>
            </div>
          </div>

          {/* EXTRA SECTION */}
          <div className="mt-8 bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-3">Welcome Admin 👋</h2>
            <p className="text-gray-600">
              Here you can manage residents, track visitors, monitor payments, 
              and control all society operations from one place.
            </p>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;