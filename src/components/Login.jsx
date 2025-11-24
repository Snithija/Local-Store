import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import { useState } from "react";

// Validation Schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Min 6 characters"),
  role: yup.string().required("Select a role"),
});

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);

    try {
      const res = await axios.post("/auth/login", {
        email: data.email,
        password: data.password,
        role: data.role,
      });

      const { token, user, role } = res.data;
      if (!token) throw new Error("Invalid credentials");

      // Role mismatch safety check
      if (role && data.role && role.toLowerCase() !== data.role.toLowerCase()) {
        setServerError(
          `Selected 'role "${data.role}" does not match account role "${role}".`
        );
        setLoading(false);
        return;
      }

      // Ensure user object exists
      const userData = user || {
        name: data.email.split("@")[0],
        email: data.email,
        role: role || data.role,
      };

      login(token, userData);

      //  Redirect based on updated roles
      switch (role || data.role) {
        case "customer":
          navigate("/customer");
          break;
        case "manager":
          navigate("/manager");
          break;
        case "delivery":
          navigate("/delivery");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
      style={{
        backgroundImage: "url('D:/Local-Store/public/Images/login-bg.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md"></div>

      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Image */}
        <div className="md:w-1/2 w-full h-64 md:h-auto">
          <img
            src="public/Images/login-page.jpg"
            alt="Login Banner"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 w-full p-8 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#48A14D]">Login</h2>
            <a
              href="/register"
              className="text-sm text-[#48A14D] hover:underline"
            >
              Sign Up
            </a>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm mb-1 text-gray-600">
                Select Role
              </label>
              <select
                {...register("role")}
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

            {/* Server error */}
            {serverError && (
              <p className="text-[#FF3B3B] text-sm mt-1">{serverError}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 mt-6 bg-[#48A14D] text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#48A14D] font-semibold hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
