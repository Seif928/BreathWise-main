import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../api/config";
import Footer from "../../components/Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    // Frontend validation
    if (!email.trim()) {
      setMessage("Please enter your email address.");
      setIsError(true);
      setIsLoading(false);
      return;
    }
    if (!validateEmail(email.trim())) {
      setMessage("Please enter a valid email address.");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.PASSWORD_RESET, {
        email: email.trim(),
      });

      setMessage(
        response.data.message ||
          response.data.detail ||
          response.data.non_field_errors?.join(", ") ||
          "A password reset link has been sent to your email."
      );
      setIsError(false);
      setEmail("");
    } catch (err) {
      console.error("Password reset error:", err);
      let errorMessage = "Failed to send reset link. Please try again.";
      if (err.code === "ERR_NETWORK") {
        errorMessage =
          "Cannot connect to the server. Please check if the backend is running.";
      } else if (err.response?.data) {
        const backendErrors = err.response.data;
        if (
          typeof backendErrors === "object" &&
          !backendErrors.message &&
          !backendErrors.detail &&
          !backendErrors.non_field_errors
        ) {
          const errorMessages = Object.entries(backendErrors)
            .map(([field, messages]) => {
              const fieldName = field
                .replace("_", " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());
              const messageText = Array.isArray(messages)
                ? messages.join(", ")
                : messages;
              return `${fieldName}: ${messageText}`;
            })
            .join("; ");
          errorMessage = errorMessages || JSON.stringify(backendErrors);
        } else {
          errorMessage =
            backendErrors.message ||
            backendErrors.detail ||
            backendErrors.non_field_errors?.join(", ") ||
            JSON.stringify(backendErrors);
        }
      }
      setMessage(errorMessage);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div
          className="bg-white p-4 rounded shadow w-100"
          style={{ maxWidth: "400px" }}
        >
          <h2 className="text-center mb-4">Forgot Password</h2>
          <p className="text-center text-muted mb-4">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>
            {message && (
              <div
                className={`alert ${
                  isError ? "alert-danger" : "alert-success"
                } mb-3`}
                role="alert"
              >
                {message}
              </div>
            )}
            <button
              type="submit"
              className="btn bg-black text-white w-100 mb-3"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          <p className="text-center text-muted">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-primary text-decoration-underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;
