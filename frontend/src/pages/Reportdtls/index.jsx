import { useRef, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../api/config";
import Footer from "../../components/Footer";
import "../../components/animations.css";

export default function Reportdtls() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const reportRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchReportDetails = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINTS.REPORTS}${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Report details:", response.data);
        console.log("Disease type:", response.data.disease_type);
        console.log("Diagnosis:", response.data.diagnosis);
        setReport(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching report details:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
        } else if (err.response?.status === 404) {
          setError("Report not found");
          setIsLoading(false);
        } else {
          setError("Failed to load report details. Please try again later.");
          setIsLoading(false);
        }
      }
    };

    fetchReportDetails();
  }, [id, navigate]);

  const handleCopy = () => {
    if (reportRef.current) {
      const text = reportRef.current.innerText;
      navigator.clipboard.writeText(text).then(() => {
        alert("✅ Report copied to clipboard!");
      });
    }
  };

  const handleDownload = () => {
    if (reportRef.current) {
      const text = reportRef.current.innerText;
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `AI_Report_${id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  // Get the image URL from the report data
  const getImageUrl = () => {
    let url = report.image?.image || report.image || report.image_url;

    if (!url) return null;

    // If it's already a full URL, return it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // If it starts with /media/, prepend the backend host
    if (url.startsWith('/media/')) {
      return `http://127.0.0.1:8000${url}`;
    }

    // Fallback for Django relative paths
    if (url.startsWith('lung_images/')) {
      return `http://127.0.0.1:8000/media/${url}`;
    }

    return url;
  };

  const imageUrl = getImageUrl();
  console.log("Report data:", report);
  console.log("Image URL:", imageUrl);

  return (
    <>
      <section className="container mt-5 bg-white rounded shadow p-4 fade-in">
        <h1 className="h3 fw-bold text-end mb-5 mt-4 d-flex justify-content-end align-items-center slide-in">
          <Link
            to="/myreports"
            className="d-flex align-items-center text-decoration-none hover-lift"
            style={{
              transition: 'all 0.3s ease',
              padding: '8px 16px',
              borderRadius: '8px',
              color: '#000'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#000';
              e.target.style.color = '#ffffff';
              e.target.querySelector('svg').style.stroke = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#000';
              e.target.querySelector('svg').style.stroke = '#000';
            }}
          >
            ALL AI Reports
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ms-2"
              style={{ transition: 'all 0.3s ease' }}
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </h1>

        <div className="mx-auto p-4" style={{ maxWidth: "768px" }}>
          <div className="mb-4">
            <div
              className="border border-2 border-dashed rounded text-center d-flex align-items-center justify-content-center img-zoom"
              style={{ height: "24rem" }}
            >
              <div className="w-100 h-100 position-relative">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="X-ray Image"
                    className="img-fluid h-100 mx-auto d-block object-fit-contain"
                    onError={(e) => {
                      console.error("Image load error:", e);
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="d-flex flex-column align-items-center justify-content-center h-100">
                    <i className="fas fa-image fa-3x text-muted mb-3 rotate"></i>
                    <span className="text-muted">No Image Available</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div ref={reportRef} className="text-reveal">
            <div className="bg-light p-4 rounded position-relative hover-lift">
              <h2 className="h4 fw-semibold text-center mb-4 slide-in">
                AI Report: {report.diagnosis?.disease_type || "Chest X-ray Analysis"}
              </h2>

              <section className="mb-4 fade-in hover-scale">
                <h4 className="fw-semibold mb-2">Study Type</h4>
                <p className="text-muted">{report.study_type || "Chest X-ray"}</p>
              </section>

              <section className="mb-4 fade-in hover-scale">
                <h4 className="fw-semibold mb-2">Date & Time</h4>
                <p className="text-muted">{new Date(report.created_at).toLocaleString()}</p>
              </section>

              <section className="mb-4 fade-in hover-scale">
                <h4 className="fw-semibold mb-2">Disease Type</h4>
                <p className="text-muted">{report.disease_type || report.diagnosis?.disease_type || "Pending Analysis"}</p>
              </section>

              <section className="mb-4 fade-in hover-scale">
                <h4 className="fw-semibold mb-2">Notes</h4>
                <p className="text-muted">{report.diagnosis?.notes || "No notes available yet."}</p>
              </section>

              {report.diagnosis?.confidence && (
                <section className="mb-4 fade-in hover-scale">
                  <h4 className="fw-semibold mb-2">Confidence</h4>
                  <p className="text-muted">{Math.round(report.diagnosis.confidence * 100)}%</p>
                </section>
              )}

              <p className="text-muted small fst-italic bg-primary-subtle p-3 rounded border border-primary-subtle fade-in pulse">
                Disclaimer: This AI-generated report is for reference only and
                should not replace professional medical diagnosis. Please consult
                with a qualified healthcare provider for accurate interpretation
                and medical advice.
              </p>
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button
              className="btn btn-success d-flex align-items-center btn-hover-effect bounce"
              onClick={handleCopy}
            >
              Copy Report
            </button>
            <button
              className="btn btn-primary d-flex align-items-center btn-hover-effect bounce"
              onClick={handleDownload}
            >
              Download Report
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
