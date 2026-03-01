import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    blockUnit: "",
    role: "Resident",
    password: "",
    confirmPassword: "",
  });

  const handleChange = async(e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async(e) => {
    e.preventDefault();

    if (isLogin) {
      try{
        const response =await axios.post('http://localhost:4000/user',formData);
        alert(response.data);
        console.log(response.status)
      }catch(err){
        console.log(err.message);
      }

      // console.log("Logging in with:", formData);
      // alert(`Login Successful as ${formData.role}!`);
      navigate("/");
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      const response = axios.post('http://localhost:4000/register',formData);
      console.log(response)
      // console.log("Registering:", formData);
      // alert("Registration Successful! Please Login.");
      setIsLogin(true);
    }
  };

 
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="w-full max-w-md bg-white/95 shadow-xl rounded-2xl p-6">
        <h3 className="text-center mb-6 font-bold text-2xl text-blue-600">
          {isLogin ? "Welcome Back" : "Join Society"}
        </h3>

        <form onSubmit={handleSubmit} method="POST">
          {/* ROLE */}
          <div className="mb-4">
            <label className="block font-bold mb-1">Select Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Resident">Resident</option>
              <option value="Admin">Admin/Manager</option>
              <option value="Security">Security Guard</option>
            </select>
          </div>

          {/* REGISTER ONLY */}
          {!isLogin && (
            <>
              <div className="mb-4">
                <label className="block mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="9876543210"
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {formData.role === "Resident" && (
                <div className="mb-4">
                  <label className="block mb-1">Block & Flat No.</label>
                  <input
                    type="text"
                    name="blockUnit"
                    placeholder="e.g. A-402"
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </>
          )}

          {/* COMMON */}
          <div className="mb-4">
            <label className="block mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          
          <div className="mb-4">
  <label className="block mb-1">Password</label>

  <div className="flex w-full border rounded overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
    <input
      type={show ? 'text' : 'password'}
      name="password"
      placeholder="******"
      onChange={handleChange}
      required
      className="flex-1 px-3 py-2 outline-none"
    />

    <button
      type="button"
      onClick={() => setShow(!show)}
      className="px-4 py-2 border-l bg-gray-300"
    >
      {show ? 'Hide' : 'Show'}
    </button>
  </div>
</div>

          {!isLogin && (
            <div className="mb-4">
              <label className="block mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="******"
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* BUTTON */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full text-white font-bold py-3 rounded-lg"
              style={{ backgroundColor: "#1a202c" }}
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </div>
        </form>

        {/* TOGGLE */}
        <div className="text-center mt-4">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 font-bold"
            >
              {isLogin ? "Register Here" : "Login Here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;