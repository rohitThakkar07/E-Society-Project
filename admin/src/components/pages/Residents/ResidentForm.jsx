import React from "react";
import { useForm } from "react-hook-form";

// 1. Upgraded Section Component for better visual grouping
const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 transition-shadow hover:shadow-md">
    <h3 className="text-lg font-bold text-gray-800 mb-5 border-b border-gray-100 pb-3">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      {children}
    </div>
  </div>
);

// 2. Upgraded Input with Validation and Error States
const Input = ({ label, register, name, rules, error, type = "text", ...rest }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-700 mb-1.5">
      {label} {rules?.required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      {...register(name, rules)}
      {...rest}
      className={`border rounded-xl px-4 py-2.5 outline-none transition-all duration-200 ${
        error
          ? "border-red-400 bg-red-50 focus:ring-4 focus:ring-red-100"
          : "border-gray-200 bg-gray-50 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      }`}
    />
    {error && <span className="text-red-500 text-xs font-medium mt-1.5">{error.message}</span>}
  </div>
);

// 3. Upgraded Select with Validation and Error States
const Select = ({ label, register, name, rules, error, children }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-700 mb-1.5">
      {label} {rules?.required && <span className="text-red-500">*</span>}
    </label>
    <select
      {...register(name, rules)}
      className={`border rounded-xl px-4 py-2.5 outline-none transition-all duration-200 appearance-none ${
        error
          ? "border-red-400 bg-red-50 focus:ring-4 focus:ring-red-100"
          : "border-gray-200 bg-gray-50 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      }`}
    >
      {children}
    </select>
    {error && <span className="text-red-500 text-xs font-medium mt-1.5">{error.message}</span>}
  </div>
);

const AddResident = () => {
  // Destructure errors from formState to display them
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Resident Data:", data);
    // TODO: axios.post("/api/resident/create", data)
    alert("Resident saved successfully!"); // Simple feedback for testing
    reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Add Resident
          </h1>
          <p className="text-gray-500 mt-2">Enter the details to register a new resident in the system.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Personal Info */}
          <Section title="Personal Information">
            <Input
              label="First Name"
              name="firstName"
              register={register}
              rules={{ required: "First name is required" }}
              error={errors.firstName}
              placeholder="John"
            />
            <Input
              label="Last Name"
              name="lastName"
              register={register}
              rules={{ required: "Last name is required" }}
              error={errors.lastName}
              placeholder="Doe"
            />
            <Select
              label="Gender"
              name="gender"
              register={register}
              rules={{ required: "Please select a gender" }}
              error={errors.gender}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              register={register}
              rules={{ required: "Date of birth is required" }}
              error={errors.dateOfBirth}
            />
          </Section>

          {/* Contact Info */}
          <Section title="Contact Information">
            <Input
              label="Mobile Number"
              name="mobileNumber"
              register={register}
              rules={{
                required: "Mobile number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit number",
                },
              }}
              error={errors.mobileNumber}
              placeholder="9876543210"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              register={register}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              error={errors.email}
              placeholder="john@example.com"
            />
          </Section>

          {/* Flat Details */}
          <Section title="Flat Details">
            <Input
              label="Wing"
              name="wing"
              register={register}
              rules={{ required: "Wing is required" }}
              error={errors.wing}
              placeholder="e.g. A"
            />
            <Input
              label="Flat Number"
              name="flatNumber"
              register={register}
              rules={{ required: "Flat number is required" }}
              error={errors.flatNumber}
              placeholder="e.g. 101"
            />
            <Input
              label="Floor Number"
              name="floorNumber"
              type="number"
              register={register}
              rules={{ required: "Floor number is required" }}
              error={errors.floorNumber}
              placeholder="1"
            />
            <Select
              label="Resident Type"
              name="residentType"
              register={register}
              rules={{ required: "Please select resident type" }}
              error={errors.residentType}
            >
              <option value="">Select Type</option>
              <option value="Owner">Owner</option>
              <option value="Tenant">Tenant</option>
              <option value="Family">Family Member</option>
            </Select>
          </Section>

          {/* Identity */}
          <Section title="Identity Details">
            <Select
              label="ID Proof Type"
              name="idProofType"
              register={register}
            >
              <option value="">Optional - Select ID</option>
              <option value="Aadhaar">Aadhaar</option>
              <option value="PAN">PAN</option>
              <option value="Driving License">Driving License</option>
              <option value="Passport">Passport</option>
            </Select>

            <Input
              label="ID Proof Number"
              name="idProofNumber"
              register={register}
              placeholder="Enter ID number"
            />
          </Section>

          {/* Emergency */}
          <Section title="Emergency Contact">
            <Input
              label="Emergency Contact Name"
              name="emergencyContactName"
              register={register}
              placeholder="Jane Doe"
            />
            <Input
              label="Emergency Contact Number"
              name="emergencyContactNumber"
              register={register}
              rules={{
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit number",
                },
              }}
              error={errors.emergencyContactNumber}
              placeholder="9876543210"
            />
          </Section>

          {/* Submit */}
          <div className="flex justify-end pt-4 pb-12">
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-3 mr-4 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-colors"
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:ring-4 focus:ring-blue-200"
            >
              Save Resident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResident;