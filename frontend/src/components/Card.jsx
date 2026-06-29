import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../api/config";
import "./Card.css";

const Card = ({ report, onDelete }) => {
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.delete(`http://127.0.0.1:8000/api/images/${report.id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log("Delete response:", response);

        if (response.status === 204 || response.status === 200) {
          if (onDelete) {
            onDelete(report.id);
          }
        } else {
          throw new Error("Unexpected response status");
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
          alert(`Failed to delete image: ${error.response.data.message || error.response.data.detail || 'Unknown error'}`);
        } else if (error.request) {
          console.error("No response received:", error.request);
          alert("No response from server. Please check your connection.");
        } else {
          console.error("Error message:", error.message);
          alert("Failed to delete image. Please try again.");
        }
      }
    }
  };

  // Get the image URL from the report data
  const getImageUrl = () => {
    let url = report.image_url || report.image;

    if (!url) return null;

    // If it's already a full URL (http:// or https://), return it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // If it starts with /media/, prepend the backend host
    if (url.startsWith('/media/')) {
      return `http://127.0.0.1:8000${url}`;
    }

    // Fallback for paths starting with lung_images (common in Django uploads)
    if (url.startsWith('lung_images/')) {
      return `http://127.0.0.1:8000/media/${url}`;
    }

    return url;
  };

  const imageUrl = getImageUrl();
  console.log("Report data:", report);
  console.log("Image URL:", imageUrl);

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100" style={{
        backgroundColor: '#e9ecef',
        border: '1px solid #dee2e6'
      }}>
        <div className="card-img-container">
          {imageUrl ? (
            <img
              src={imageUrl}
              className="card-img-top"
              alt="Medical scan"
              onError={(e) => {
                console.error("Image load error:", e);
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
              }}
            />
          ) : (
            <div className="no-image-placeholder">
              <i className="fas fa-image"></i>
              <span>No Image Available</span>
            </div>
          )}
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start">
            <h5 className="card-title">
              {report.diagnosis?.disease_type || "Pending Analysis"}
            </h5>
            <span className={`badge ${report.status === "completed" ? "bg-success" : "bg-warning"}`}>
              {report.status}
            </span>
          </div>
          <p className="card-text">
            <small className="text-muted">
              {new Date(report.created_at).toLocaleString()}
            </small>
          </p>
          {report.diagnosis?.confidence && (
            <p className="card-text">
              Confidence: {Math.round(report.diagnosis.confidence * 100)}%
            </p>
          )}
        </div>
        <div className="card-footer bg-transparent border-top-0">
          <div className="d-flex justify-content-between">
            <Link to={`/myreports/${report.id}`} className="btn" style={{
              backgroundColor: '#0000cc',
              borderColor: '#0000cc',
              color: '#fff'
            }}>
              View Details
            </Link>
            <button
              className="btn"
              onClick={handleDelete}
              style={{
                backgroundColor: '#c00000',
                borderColor: '#c00000',
                color: '#fff'
              }}
            >
              <i className="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
