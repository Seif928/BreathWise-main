import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../api/config";
import Card from "../../components/Card";
import Footer from "../../components/Footer";

const PatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [xrayFile, setXrayFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("Idle");
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Please log in to view your profile.");
        }
        const response = await axios.get(`${API_BASE_URL}profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatient({
          name: `${response.data.first_name} ${response.data.last_name}`,
          email: response.data.email || "N/A",
          username: response.data.username,
          avatar: "https://via.placeholder.com/150", // Replace if backend provides avatar
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
        setMessage(err.message || "Failed to load profile.");
        setIsError(true);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    // Fetch diagnosis history
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${API_BASE_URL}images/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(
          response.data.map((item) => ({
            id: item.id,
            date: item.uploaded_at,
            disease_type: item.diagnosis?.disease_type || "Pending",
            result: item.diagnosis?.disease_type ? "Analyzed" : "Pending",
            notes: item.diagnosis?.notes || "None",
            confidence: item.diagnosis?.confidence || null,
          }))
        );
      } catch (err) {
        console.error("History fetch error:", err);
        setMessage("Failed to load history.");
        setIsError(true);
      }
    };

    fetchProfile();
    fetchHistory();
  }, [navigate]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      ["image/jpeg", "image/png", "application/dicom"].includes(file.type)
    ) {
      setXrayFile(file);
      setStatus("Selected");
      setMessage("");
      setIsError(false);

      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setMessage("Please upload a file in JPG, PNG, or DICOM format.");
      setIsError(true);
      setXrayFile(null);
      setImagePreview(null);
    }
  };

  const handleFileUpload = async () => {
    if (!xrayFile) {
      setMessage("Please select a file to upload.");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setStatus("Uploading");
    setMessage("");
    setIsError(false);

    const formData = new FormData();
    formData.append("image", xrayFile);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Please log in to upload an image.");
      }
      const response = await axios.post(
        `${API_BASE_URL}images/upload/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch diagnosis
      let diagnosisData = {};
      try {
        const diagnosisResponse = await axios.get(
          `${API_BASE_URL}diagnoses/${response.data.id}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        diagnosisData = diagnosisResponse.data;
      } catch (diagnosisErr) {
        console.error("Diagnosis fetch error:", diagnosisErr);
        diagnosisData = { disease_type: null, diagnosed_at: null };
      }

      const newAnalysis = {
        hasIssues:
          diagnosisData.disease_type && diagnosisData.disease_type !== "Normal",
        recommendation: diagnosisData.notes || "Consult a specialist if needed",
        confidence: diagnosisData.confidence || null,
        disease_type: diagnosisData.disease_type || "Pending",
        diagnosed_at: diagnosisData.diagnosed_at,
      };

      setAnalysis(newAnalysis);
      setStatus("Completed");
      setNotifications([
        ...notifications,
        "X-ray analysis completed successfully!",
      ]);

      // Update history
      setHistory([
        {
          id: response.data.id,
          date: response.data.uploaded_at,
          disease_type: newAnalysis.disease_type,
          result: newAnalysis.disease_type ? "Analyzed" : "Pending",
          notes: newAnalysis.recommendation,
          confidence: newAnalysis.confidence,
        },
        ...history,
      ]);

      setXrayFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Upload error:", err);
      let errorMessage = "Failed to upload image. Please try again.";
      if (err.message === "Please log in to upload an image.") {
        errorMessage = "You must be logged in to upload an image.";
        navigate("/login");
      } else if (err.code === "ERR_NETWORK") {
        errorMessage =
          "Cannot connect to the server. Please check if the backend is running.";
      } else if (err.response?.data) {
        const backendErrors = err.response.data;
        if (
          (backendErrors.image &&
            (backendErrors.image.includes("This field may not be blank.") ||
              typeof backendErrors.image === "string")) ||
          backendErrors.image === null
        ) {
          errorMessage =
            "No image file was received. Please select a valid file and try again.";
        } else if (
          typeof backendErrors === "object" &&
          !backendErrors.message &&
          !backendErrors.detail
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
            JSON.stringify(backendErrors);
        }
      }
      setMessage(errorMessage);
      setIsError(true);
      setStatus("Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = (exam) => {
    const report = `X-ray Examination Report\nDate: ${new Date(
      exam.date
    ).toLocaleDateString()}\nDisease: ${
      exam.disease_type || "Pending"
    }\nResult: ${exam.result || "Not available"}\nNotes: ${
      exam.notes || "None"
    }\nConfidence: ${exam.confidence ? `${exam.confidence}%` : "N/A"}`;
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report_${exam.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="container my-5" dir="ltr">
        <div className="card shadow">
          <div className="card-body">
            {/* Patient Info */}
            {patient ? (
              <div className="d-flex align-items-center mb-4">
                <img
                  src={patient.avatar}
                  alt="Profile Picture"
                  className="rounded-circle me-3"
                  style={{ width: "100px", height: "100px" }}
                />
                <div>
                  <h2 className="card-title">{patient.name}</h2>
                  <p className="mb-1">Username: {patient.username}</p>
                  <p className="mb-1">Email: {patient.email}</p>
                </div>
              </div>
            ) : (
              <p>Loading profile...</p>
            )}

            {/* X-ray Upload */}
            <div className="mb-4">
              <h3 className="h5 mb-3">Upload Chest X-ray</h3>
              <div className="mb-3">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.dcm"
                  onChange={handleFileChange}
                  className="form-control mb-2"
                  disabled={isLoading}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="X-ray Preview"
                    className="img-thumbnail mb-2"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                )}
                <button
                  className="btn bg-black text-white"
                  onClick={handleFileUpload}
                  disabled={isLoading || !xrayFile}
                >
                  {isLoading ? "Uploading..." : "Analyze X-ray"}
                </button>
              </div>
              <p>
                Examination Status: <span className="fw-bold">{status}</span>
              </p>
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
            </div>

            {/* AI Analysis Summary */}
            {analysis && (
              <div className="alert alert-info mb-4">
                <h3 className="h5 mb-3">AI Analysis Summary</h3>
                <p>
                  Pathological Indicators: {analysis.hasIssues ? "Yes" : "No"}
                </p>
                <p>Disease: {analysis.disease_type}</p>
                <p>Recommendation: {analysis.recommendation}</p>
                <p>
                  Confidence Level:{" "}
                  {analysis.confidence ? `${analysis.confidence}%` : "N/A"}
                </p>
                <p>
                  Diagnosed At:{" "}
                  {analysis.diagnosed_at
                    ? new Date(analysis.diagnosed_at).toLocaleString()
                    : "Not yet diagnosed"}
                </p>
              </div>
            )}

            {/* Results History */}
            <div className="mb-4">
              <h3 className="h5 mb-3">Examination History</h3>
              {history.length === 0 ? (
                <p>No examination history available.</p>
              ) : (
                <div className="row">
                  {history.map((exam) => (
                    <Card
                      key={exam.id}
                      id={exam.id}
                      date={exam.date}
                      disease_type={exam.disease_type}
                      result={exam.result}
                      notes={exam.notes}
                      confidence={exam.confidence}
                      onDownload={downloadReport}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            {notifications.length > 0 && (
              <div className="mb-4">
                <h3 className="h5 mb-3">Notifications</h3>
                <ul className="list-group">
                  {notifications.map((note, index) => (
                    <li key={index} className="list-group-item">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PatientProfile;
