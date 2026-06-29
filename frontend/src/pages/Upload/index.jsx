import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../api/config";
import Footer from "../../components/Footer";
import Swal from 'sweetalert2';
import "./style.css";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const navigate = useNavigate();

  // Check token on component mount and before each request
  const checkAuth = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return null;
    }
    return token;
  };

  useEffect(() => {
    checkAuth();
  }, [navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/dicom'];
      if (!allowedTypes.includes(selectedFile.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type',
          text: 'Please select a valid file type (JPG, PNG, PDF, or DICOM).'
        });
        setMessage("Please select a valid file type (JPG, PNG, PDF, or DICOM).");
        setIsError(true);
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (selectedFile.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'File size should be less than 10MB.'
        });
        setMessage("File size should be less than 10MB.");
        setIsError(true);
        return;
      }

      setFile(selectedFile);
      setMessage(`Selected file: ${selectedFile.name}`);
      setIsError(false);

      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setImagePreview(null);
      setMessage("No file selected.");
      setIsError(true);
    }
    setAnalysisResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check authentication
    const token = checkAuth();
    if (!token) return;

    if (!file) {
      Swal.fire({
        icon: 'warning',
        title: 'No File Selected',
        text: 'Please select a file to upload.'
      });
      setMessage("Please select a file to upload.");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage("");
    setIsError(false);

    const formData = new FormData();
    formData.append("image", file);

    try {
      console.log("Sending request with token:", token); // Debug log

      // Upload the image
      const response = await axios.post(
        API_ENDPOINTS.IMAGE_UPLOAD,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log("Upload response:", response.data);

      // Fetch diagnosis
      let diagnosisData = {};
      try {
        const diagnosisResponse = await axios.get(
          `${API_ENDPOINTS.DIAGNOSES()}${response.data.id}/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        diagnosisData = diagnosisResponse.data;
        console.log("Diagnosis response:", diagnosisData);
      } catch (diagnosisErr) {
        console.error("Diagnosis fetch error:", diagnosisErr);
        diagnosisData = {
          disease_type: "Pending Analysis",
          diagnosed_at: new Date().toISOString(),
          confidence: null,
          notes: "Analysis in progress..."
        };
      }

      setAnalysisResult({
        ...response.data,
        diagnosis: diagnosisData
      });
      setMessage("Image uploaded successfully! Analysis in progress...");
      setIsError(false);
      setFile(null);
      setImagePreview(null);
      Swal.fire({
        icon: 'success',
        title: 'Analysis Complete! 🧬',
        text: 'Your image has been analyzed successfully.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      console.error("Upload error:", err);
      let errorMessage = "Failed to upload image. Please try again.";

      if (err.code === "ERR_NETWORK") {
        errorMessage = "Cannot connect to the server. Please check if the backend is running.";
      } else if (err.response?.status === 401) {
        errorMessage = "Your session has expired. Please log in again.";
        localStorage.removeItem("authToken");
        navigate("/login");
      } else if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === "string" && (data.includes("<!doctype html>") || data.includes("<html"))) {
          errorMessage = "A server error occurred. Please try again later or contact support if the issue persists.";
        } else if (data.image) {
          errorMessage = "Invalid image file. Please try again.";
        } else if (typeof data === "object") {
          errorMessage = Object.entries(data)
            .map(([field, messages]) => {
              const fieldName = field.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase());
              const messageText = Array.isArray(messages) ? messages.join(", ") : messages;
              return `${fieldName}: ${messageText}`;
            })
            .join("; ");
        } else {
          errorMessage = data.message || JSON.stringify(data);
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: errorMessage
      });
      setMessage(errorMessage);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bgupload pt-5">
        <div className="text-center pt-5">
          <h3 className="text-black mt-5 fs-1 fw-bold mt-3 slide-in">X-ray AI Read</h3>
          <h3 className="text-black fs-1 fw-bold mt-3 slide-in">
            Instant AI Analysis for X-ray Images
          </h3>
          <p className="text-black mt-3 fs-3 w-75 m-auto slide-in">
            Upload your X-ray images and get instant, AI-powered analysis and
            interpretation. Understand your X-rays quickly and easily, without
            medical expertise.
          </p>
        </div>
      </div>
      <div id="to-upload" className="container shadow py-5 mt-5 rounded-4 mb-5 hover-lift">
        <h2 className="text-center fw-bold mb-5 slide-in d-flex justify-content-center">Upload your X-RAY</h2>

        {message && (
          <div className={`alert ${isError ? "alert-danger" : "alert-success"} mb-4 fade-in`} role="alert">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="d-flex flex-column align-items-center justify-content-center w-100 py-5 h-100 hover-scale" style={{ cursor: "pointer" }}>
            <input
              accept=".jpg,.jpeg,.png,.pdf,.dcm"
              type="file"
              className="d-none"
              onChange={handleFileChange}
              disabled={isLoading}
            />
            <div className="d-flex p-5 flex-column align-items-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Selected X-ray"
                  className="img-zoom"
                  style={{ maxWidth: "200px", maxHeight: "200px", marginBottom: "0.5rem" }}
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-2 text-primary "
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              )}
              <span className="text-muted pulse">
                {isLoading ? "Uploading..." : "Click to upload or drag and drop"}
              </span>
              <small className="text-muted mt-2">JPG, PNG, PDF, or DICOM (max 10MB)</small>
            </div>
          </label>

          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary px-5 bounce "
              disabled={isLoading || !file}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2 rotate" role="status" aria-hidden="true"></span>
                  Uploading...
                </>
              ) : (
                "Upload and Analyze"
              )}
            </button>
          </div>
        </form>

        {analysisResult && (
          <div className="mt-5 fade-in">
            <h3 className="text-center mb-4 slide-in">Analysis Results</h3>
            <div className="card hover-lift" style={{ backgroundColor: '#f8f9fa', border: '2px solid #e9ecef' }}>
              <div className="card-body p-4">
                <h5 className="card-title mb-4 text-reveal" style={{ color: '#0d6efd' }}>Diagnosis</h5>
                <div className="bg-white p-3 rounded shadow-sm hover-scale">
                  <p className="card-text mb-3 fade-in">
                    <strong>Disease Type:</strong>{" "}
                    {analysisResult.diagnosis?.disease_type || "Pending Analysis"}
                  </p>
                  <p className="card-text fade-in">
                    <strong>Notes:</strong>{" "}
                    {analysisResult.diagnosis?.notes || "No additional notes available."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
