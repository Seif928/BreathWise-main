import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home/index";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Upload from "./pages/Upload";
import MyProfile from "./pages/Myreports/index";
import Reportdtls from "./pages/Reportdtls/index";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import ForgotPassword from "./pages/Login/ForgotPassword";
import axios from "axios";
import { API_ENDPOINTS } from "./api/config";
import DiseaseDetails from "./pages/Diseases";
// import HealthTips from "./pages/HealthTips";
// import MedicalArticles from "./pages/MedicalArticles";
// import WellnessGuide from "./pages/WellnessGuide";
// import MentalHealth from "./pages/MentalHealth";
// import FitnessTips from "./pages/FitnessTips";
import HealthInfo from "./pages/HealthInfo";

function App() {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Function to validate token and get user data
  const validateToken = async (token) => {
    try {
      if (!token) {
        throw new Error("No token found");
      }

      // Verify token format
      if (typeof token !== "string" || !token.includes(".")) {
        throw new Error("Invalid token format");
      }

      // Decode token to check expiration
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp && decoded.exp < currentTime) {
        throw new Error("Token expired");
      }

      // Verify token with backend
      const response = await axios.get(API_ENDPOINTS.PROFILE, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserData(response.data);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error("Token validation error:", err);
      localStorage.removeItem("authToken");
      setUserData(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  // Check authentication on app startup
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      await validateToken(token);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  async function logOut() {
    localStorage.removeItem("authToken");
    setUserData(null);
    setIsAuthenticated(false);
    window.location.href = "/home";
  }

  function ProtectedRoute({ children }) {
    if (isLoading) {
      return (
        <div className="container mt-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return children;
  }

  function PublicRoute({ children, allowAuthenticated = false }) {
    if (isLoading) {
      return (
        <div className="container mt-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (isAuthenticated && !allowAuthenticated) {
      return <Navigate to="/home" replace />;
    }

    return children;
  }

  return (
    <>
      <Navbar userData={userData} setUserData={setUserData} logOut={logOut} />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myreports"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myreports/:id"
          element={
            <ProtectedRoute>
              <Reportdtls />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diseases/:diseaseId"
          element={
            <ProtectedRoute>
              <DiseaseDetails />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/health-tips" element={<HealthTips />} /> */}
        {/* <Route path="/medical-articles" element={<MedicalArticles />} /> */}
        {/* <Route path="/wellness-guide" element={<WellnessGuide />} /> */}
        {/* <Route path="/mental-health" element={<MentalHealth />} /> */}
        {/* <Route path="/fitness-tips" element={<FitnessTips />} /> */}
        <Route path="/health-info" element={<HealthInfo />} />
        <Route
          path="/login"
          element={
            <PublicRoute allowAuthenticated={true}>
              <Login setUserData={setUserData} setIsAuthenticated={setIsAuthenticated} />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute allowAuthenticated={true}>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

export default App;
