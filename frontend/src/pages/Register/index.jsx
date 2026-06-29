import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../api/config";
import Footer from "../../components/Footer";
import Swal from 'sweetalert2';

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    age: "",
    gender: "",
    password: "",
    password_confirmation: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "first_name":
      case "last_name":
        if (!value.trim()) {
          newErrors[name] = "This field is required.";
        } else if (value.length < 2) {
          newErrors[name] = "Must be at least 2 characters.";
        } else {
          delete newErrors[name];
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = "Email is required.";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Invalid email format.";
        } else {
          delete newErrors.email;
        }
        break;

      case "phone_number":
        const phoneRegex = /^\d{10,15}$/;
        if (value && !phoneRegex.test(value)) {
          newErrors.phone_number = "Phone must be 10-15 digits.";
        } else {
          delete newErrors.phone_number;
        }
        break;

      case "age":
        if (value && (isNaN(value) || value <= 0)) {
          newErrors.age = "Age must be a positive number.";
        } else {
          delete newErrors.age;
        }
        break;

      case "password":
        if (!value) {
          newErrors.password = "Password is required.";
        } else if (value.length < 8) {
          newErrors.password = "Password must be at least 8 characters.";
        } else {
          delete newErrors.password;
        }
        break;

      case "password_confirmation":
        if (value !== formData.password) {
          newErrors.password_confirmation = "Passwords do not match.";
        } else {
          delete newErrors.password_confirmation;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);

    // Special case: re-validate confirm password if main password changes
    if (name === "password" && formData.password_confirmation) {
      validateField("password_confirmation", formData.password_confirmation);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);


    // Client-side validation for password confirmation
    if (formData.password !== formData.password_confirmation) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Passwords do not match.'
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.REGISTER, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        age: parseInt(formData.age) || null,
        gender: formData.gender,
        password: formData.password
      });

      console.log("Registration successful:", response.data);

      Swal.fire({
        title: 'Registration Successful! 🚀',
        text: 'You can now log in.',
        icon: 'success',
        confirmButtonText: 'Great!'
      }).then(() => {
        navigate("/login");
      });

    } catch (err) {
      console.error("Registration error:", err);
      let errorMessage = "Registration failed. Please try again.";
      if (err.code === "ERR_NETWORK") {
        errorMessage = "Cannot connect to the server. Please check if the backend is running.";
      } else if (err.response?.data) {
        errorMessage = err.response.data.message || JSON.stringify(err.response.data);
      }

      Swal.fire({
        title: 'Registration Failed',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Try Again'
      });

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div
          className="p-4 mt-5 shadow-lg rounded bg-white"
          style={{ width: "400px" }}
        >
          <h5 className="text-center mb-3">Sign up</h5>



          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Control
                    type="text"
                    name="first_name"
                    className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                    required
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Control
                    type="text"
                    name="last_name"
                    className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                    required
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                required
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="tel"
                name="phone_number"
                className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`}
                placeholder="Phone Number"
                value={formData.phone_number}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.phone_number && <div className="invalid-feedback">{errors.phone_number}</div>}
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Control
                    type="number"
                    name="age"
                    className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                    placeholder="Age"
                    min="1"
                    value={formData.age}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Select
                    name="gender"
                    className="form-control"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                name="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                name="password_confirmation"
                className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                required
                placeholder="Repeat password"
                value={formData.password_confirmation}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation}</div>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                required
                label="I have read and agree to the terms"
                disabled={isLoading}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 bg-black text-white"
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </Button>
          </Form>
          <p className="text-center mt-3">
            Already have an account? <NavLink to={"/login"}>Log in</NavLink>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;
