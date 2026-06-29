import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS, getAuthHeader } from "../api/config";
import Logo from "./Logo";
import "./style.css";
import Swal from 'sweetalert2';

export default function Navbar({ userData, setUserData }) {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // First remove the token from localStorage
      localStorage.removeItem("authToken");
      setUserData(null);

      // Then try to notify the backend (but don't wait for it)
      try {
        await axios.post(
          API_ENDPOINTS.LOGOUT,
          {},
          {
            headers: getAuthHeader()
          }
        );
      } catch (backendErr) {
        console.warn("Backend logout notification failed:", backendErr);
        // We don't need to handle this error as we've already logged out locally
      }

      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      let errorMessage = "Failed to log out. Please try again.";
      if (err.code === "ERR_NETWORK") {
        errorMessage = "Cannot connect to the server. Please check your network.";
      } else if (err.response?.data) {
        const backendErrors = err.response.data;
        errorMessage = backendErrors.message || backendErrors.detail || JSON.stringify(backendErrors);
      } else if (err.response?.status === 401) {
        errorMessage = "Invalid or expired token. Please log in again.";
      }

      Swal.fire({
        icon: 'error',
        title: 'Logout Error',
        text: errorMessage
      });
      setMessage(errorMessage);
      setIsError(true);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg fixed-top nave navbar-dark">
        <div className="container">
          <Logo />
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link me-3 ${isActive ? "active" : ""}`
                  }
                  to="/home"
                >
                  Home
                </NavLink>
              </li>
              {userData && (
                <>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        `nav-link me-3 ${isActive ? "active" : ""}`
                      }
                      to="/upload"
                    >
                      Upload
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        `nav-link me-3 ${isActive ? "active" : ""}`
                      }
                      to="/myreports"
                    >
                      My Reports
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              {userData ? (
                <li className="nav-item">
                  <button
                    className="nav-link me-3 logout"
                    onClick={logOut}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      padding: '0.5rem 1rem',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#ff4444';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#fff';
                    }}
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link me-3 ${isActive ? "active" : ""}`
                    }
                    to="/login"
                    style={{
                      color: '#fff',
                      textDecoration: 'none',
                      padding: '0.5rem 1rem',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#4CAF50';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#fff';
                    }}
                  >
                    Login
                  </NavLink>
                </li>
              )}
            </ul>
            {message && (
              <div
                className={`alert ${isError ? "alert-danger" : "alert-success"
                  } alert-dismissible fade show ms-3`}
                role="alert"
                style={{ maxWidth: "300px" }}
              >
                {message}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMessage("")}
                  aria-label="Close"
                ></button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
