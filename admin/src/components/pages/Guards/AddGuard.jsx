import React from "react";
import { useForm } from "react-hook-form";

const AddGuard = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log(data);

    // Example API
    // axios.post("/api/guard/create", data)

    reset();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">

        <h2 className="text-2xl font-bold mb-6">Add Guard</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              {...register("name")}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter guard name"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm text-gray-600">Gender</label>
            <select
              {...register("gender")}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          {/* Mobile */}
          <div>
            <label className="text-sm text-gray-600">Mobile Number</label>
            <input
              {...register("mobileNumber")}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter mobile number"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter email"
            />
          </div>

          {/* Shift */}
          <div>
            <label className="text-sm text-gray-600">Shift</label>
            <select
              {...register("shift")}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Shift</option>
              <option>Morning</option>
              <option>Evening</option>
              <option>Night</option>
            </select>
          </div>

          {/* Gate */}
          <div>
            <label className="text-sm text-gray-600">Gate Assigned</label>
            <input
              {...register("gateAssigned")}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Main Gate / Back Gate"
            />
          </div>

          {/* Joining Date */}
          <div>
            <label className="text-sm text-gray-600">Joining Date</label>
            <input
              type="date"
              {...register("joiningDate")}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 mt-4 text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add Guard
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default AddGuard;