import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios.js";

// Validation Schema
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Full name is required")
    .min(3, "At least 3 characters"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Min 6 characters"),
  role: yup.string().required("Select a role"),
  managerName: yup.string().when("role", {
    is: "manager",
    then: () => yup.string().required("manager name is required"),
  }),
});

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [showManagerFields, setShowManagerFields] = React.useState(false);
  const [registrationError, setRegistrationError] = React.useState("");

  React.useEffect(() => {
    setRegistrationError("");
  }, []);

  const onSubmit = async (data) => {
    try {
      setRegistrationError("");

      let payload = {
        ...data,
        address: "",
        location: { lat: 0, lng: 0 },
      };

      if (data.role === "manager") {
        payload = {
          ...payload,
          manager: {
            name: data.managerName,
            rating: 0,
            menu: [],
          },
        };
      }

      console.log("Sending registration request:", payload);
      const res = await axiosInstance.post("/auth/register", payload);

      if (res.status === 201 || res.status === 200) {
        alert("Registration successful! Please log in.");
        navigate("/login");
      } else {
        setRegistrationError(
          res.data.message ||
            "Registration failed. Please check your details and try again."
        );
      }
    } catch (err) {
      console.error("Registration error:", err);
      if (err.code === "ERR_NETWORK") {
        setRegistrationError(
          "Unable to connect to the server. Please check if the server is running."
        );
      } else {
        setRegistrationError(
          err.response?.data?.message ||
            "Registration failed. Please check your details and try again."
        );
      }
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      
      {/* ✅ Blurred Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/Images/login-bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px)",
        }}
      ></div>

      {/* Optional green overlay to keep theme */}
      <div className="absolute inset-0 bg-green-800/30"></div>

      {/* Main content (unchanged) */}
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Image */}
        <div className="md:w-1/2 w-full h-64 md:h-auto">
          <img
            src="Local-Store/public/assests/register-page.jpg"
            alt="Register Banner"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 w-full p-8 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#48A14D]">
              Create an Account
            </h2>
            <Link to="/login" className="text-sm text-[#48A14D] hover:underline">
              Sign In
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm mb-1 text-gray-600">
                Full Name
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="Enter your name"
                className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:border-[#48A14D] outline-none"
              />
              {errors.name && (
                <p className="text-[#FF3B3B] text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-1 text-gray-600">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:border-[#48A14D] outline-none"
              />
              {errors.email && (
                <p className="text-[#FF3B3B] text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-1 text-gray-600">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:border-[#48A14D] outline-none"
              />
              {errors.password && (
                <p className="text-[#FF3B3B] text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm mb-1 text-gray-600">
                Select Role
              </label>
              <select
                {...register("role")}
                onChange={(e) => {
                  register("role").onChange(e);
                  setShowManagerFields(e.target.value === "manager");
                }}
                className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:border-[#48A14D] outline-none"
              >
                <option value="">-- Choose Role --</option>
                <option value="customer">Customer</option>
                <option value="manager">Manager Outlet</option>
                <option value="delivery">Delivery Partner</option>
              </select>
              {errors.role && (
                <p className="text-[#FF3B3B] text-sm mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Manager-specific fields */}
            {showManagerFields && (
              <div>
                <label className="block text-sm mb-1 text-gray-600">
                  Manager Name
                </label>
                <input
                  {...register("managerName")}
                  type="text"
                  placeholder="Enter manager name"
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:border-[#48A14D] outline-none"
                />
                {errors.managerName && (
                  <p className="text-[#FF3B3B] text-sm mt-1">
                    {errors.managerName.message}
                  </p>
                )}
              </div>
            )}

            {/* Error Message */}
            {registrationError && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {registrationError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full p-3 mt-6 bg-[#48A14D] text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Register
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-sm text-[#48A14D] hover:underline">
              LogIn
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
