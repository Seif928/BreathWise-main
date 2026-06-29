import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS, getAuthHeader } from "../../api/config";
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';

export default function LoginForm({ setUserData, setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = [];
    if (!email.trim()) errors.push("Email is required.");
    if (!password) errors.push("Password is required.");
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(" "));
      setIsLoading(false);
      return;
    }

    try {
      // 🔐 LOGIN REQUEST
      const loginResponse = await axios.post(API_ENDPOINTS.LOGIN, {
        email: email.trim(),
        password: password,
      });

      console.log("Login response data:", loginResponse.data);

      // 🧠 Get token from possible fields
      const token =
        loginResponse.data.access ||
        loginResponse.data.access_token ||
        loginResponse.data.token ||
        null;

      if (!token) {
        console.error("Login successful, but token is missing in response:", loginResponse.data);
        throw new Error("Invalid login response: token missing.");
      }

      // 🗃️ Store token
      localStorage.setItem("authToken", token);

      // 👤 Fetch profile
      try {
        const profileResponse = await axios.get(API_ENDPOINTS.PROFILE, {
          headers: getAuthHeader()
        });

        if (profileResponse.data) {
          setUserData(profileResponse.data);
          setIsAuthenticated(true);
          console.log("Profile loaded:", profileResponse.data);
        }
      } catch (profileErr) {
        console.warn("Profile fetch failed:", profileErr);
        throw new Error("Failed to load user profile");
      }

      navigate("/home");
      return;

    } catch (err) {
      console.dir(err);
      let errorMessage = "Login failed. Please check your credentials and try again.";

      if (err.code === "ERR_NETWORK") {
        errorMessage = "Cannot connect to the server. Please check your internet connection.";
      } else if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Invalid email or password.";
        } else if (err.response.status === 400) {
          errorMessage = "Please check your email and password.";
        } else if (err.response.data) {
          if (typeof err.response.data === "object") {
            errorMessage = Object.values(err.response.data).flat().join(", ");
          } else {
            errorMessage = err.response.data;
          }
        }
      }

      Swal.fire({
        title: 'Login Failed',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });

      setError(errorMessage);
      localStorage.removeItem("authToken");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center my-3">Log In</h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <label className="form-check-label">
              <input
                type="checkbox"
                className="form-check-input me-1"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                disabled={isLoading}
              />
              Remember me
            </label>
            <NavLink to="/forgot-password" className="text-primary text-decoration-none">
              Forgot password?
            </NavLink>
          </div>

          <button
            type="submit"
            className="btn bg-black text-white w-100"
            disabled={isLoading}
          >
            {isLoading ? "Logging In..." : "Log In"}
          </button>
        </form>

        <p className="text-center mt-3">
          Not a member? <NavLink to="/register">Register</NavLink>
        </p>
      </div>
    </div>
  );
}
