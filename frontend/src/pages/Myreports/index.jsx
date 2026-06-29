import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import axios from "axios";
import { API_ENDPOINTS } from "../../api/config";
import Card from "../../components/Card";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import "./style.css";

export default function MyProfile() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: ''
  });
  const [updateMessage, setUpdateMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("Current token:", token);

    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.PROFILE, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
        setEditForm({
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || '',
          email: response.data.email || '',
          phone_number: response.data.phone_number || ''
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      }
    };

    const fetchReports = async () => {
      try {
        setIsLoading(true);
        setError("");

        const params = new URLSearchParams({
          page,
          sort_by: sortBy,
          sort_order: sortOrder
        });

        const url = `${API_ENDPOINTS.DIAGNOSES()}?${params}`;
        console.log("Fetching from URL:", url);

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("API Response:", response.data);

        const transformedData = Array.isArray(response.data) ? response.data : response.data.results || [];
        console.log("Transformed data:", transformedData);

        const reports = transformedData.map(item => {
          console.log("Processing item:", item);
          return {
            id: item.id,
            image: item.image,
            image_url: item.image || null, // API usually returns path in 'image' field
            created_at: item.created_at || item.diagnosed_at,
            status: item.disease_type ? 'completed' : 'pending',
            diagnosis: {
              disease_type: item.disease_type || null,
              confidence: item.confidence || null,
              notes: item.notes || null,
              diagnosed_at: item.diagnosed_at || item.created_at
            }
          };
        });

        console.log("Final reports data:", reports);

        setReports(reports);
        setTotalPages(response.data.total_pages || 1);
        setIsLoading(false);
      } catch (err) {
        console.error("Error details:", err.response || err);
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
        } else if (err.response?.status === 404) {
          setError("The diagnoses endpoint is not available. Please make sure the backend server is running.");
        } else if (err.code === 'ERR_NETWORK') {
          setError("Cannot connect to the server. Please make sure the backend server is running on port 8000.");
        } else {
          setError("Failed to load reports. Please try again later.");
        }
        setIsLoading(false);
      }
    };

    fetchUserData();
    fetchReports();
  }, [navigate, sortBy, sortOrder, page, refreshTrigger]);

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const sortedReports = [...reports].sort((a, b) => {
    if (sortBy === 'disease') {
      const diseaseA = a.diagnosis?.disease_type || 'Pending Analysis';
      const diseaseB = b.diagnosis?.disease_type || 'Pending Analysis';
      return sortOrder === 'asc'
        ? diseaseA.localeCompare(diseaseB)
        : diseaseB.localeCompare(diseaseA);
    } else {
      // Sort by date
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'asc'
        ? dateA - dateB
        : dateB - dateA;
    }
  });

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeleteReport = (reportId) => {
    setReports(prevReports => prevReports.filter(report => report.id !== reportId));
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setUpdateMessage({ text: '', type: '' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      email: userData.email || '',
      phone_number: userData.phone_number || ''
    });
    setUpdateMessage({ text: '', type: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.patch(
        API_ENDPOINTS.PROFILE,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUserData(response.data);
      setIsEditing(false);
      setUpdateMessage({
        text: 'Profile updated successfully!',
        type: 'success'
      });

      // Clear the success message after 2 seconds
      setTimeout(() => {
        setUpdateMessage({ text: '', type: '' });
      }, 2000);

    } catch (err) {
      console.error("Error updating profile:", err);
      setUpdateMessage({
        text: err.response?.data?.message || 'Failed to update profile. Please try again.',
        type: 'error'
      });
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
          <button
            className="btn btn-outline-danger ms-3"
            onClick={handleRefresh}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mt-5">
        {/* User Profile Section */}
        <div className="card shadow mb-4 mt-10">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">Profile Information</h2>
              {!isEditing && (
                <button
                  className="btn"
                  onClick={handleEditClick}
                  style={{
                    backgroundColor: '#000',
                    borderColor: '#000',
                    color: '#fff'
                  }}
                >
                  <i className="fas fa-edit me-2"></i>
                  Edit Profile
                </button>
              )}
            </div>

            {updateMessage.text && (
              <div className={`alert alert-${updateMessage.type === 'success' ? 'success' : 'danger'} mb-4`}>
                {updateMessage.text}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">First Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="first_name"
                        value={editForm.first_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Last Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="last_name"
                        value={editForm.last_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Email:</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={editForm.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Phone Number:</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone_number"
                        value={editForm.phone_number}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      backgroundColor: '#000',
                      borderColor: '#000',
                      color: '#fff'
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="fw-bold text-muted">Name:</label>
                    <p className="mb-0">{userData?.first_name} {userData?.last_name}</p>
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold text-muted">Phone Number:</label>
                    <p className="mb-0">{userData?.phone_number || 'Not provided'}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="fw-bold text-muted">Email:</label>
                    <p className="mb-0">{userData?.email}</p>
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold text-muted">Account Type:</label>
                    <p className="mb-0">{userData?.is_staff ? 'Admin' : 'User'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reports Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>My Reports</h2>
          <div className="d-flex gap-2">
            <button
              className="btn"
              onClick={handleRefresh}
              style={{
                backgroundColor: '#000',
                borderColor: '#000',
                color: '#fff'
              }}
            >
              <i className="fas fa-sync-alt me-2"></i>
              Refresh
            </button>
            <HashLink to="/upload#to-upload" smooth className="btn" style={{
              backgroundColor: '#0000aa',
              borderColor: '#0000aa',
              color: '#fff',
              textDecoration: 'none'
            }}>
              <i className="fas fa-upload me-2"></i>
              Upload New
            </HashLink>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="btn-group" role="group">
              <button
                type="button"
                className="btn"
                style={{
                  backgroundColor: '#000',
                  borderColor: '#000',
                  color: '#fff'
                }}
              >
                All
              </button>
            </div>
          </div>
          <div className="col-md-6 text-end">
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn ${sortBy === 'date' ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => handleSortChange('date')}
              >
                Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                type="button"
                className={`btn ${sortBy === 'disease' ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => handleSortChange('disease')}
              >
                Disease {sortBy === 'disease' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        {reports.length === 0 ? (
          <div className="alert alert-info mt-5">
            <i className="fas fa-info-circle me-2"></i>
            You haven't uploaded any reports yet.{" "}
            <HashLink to="/upload#to-upload" smooth className="alert-link">
              Upload your first report
            </HashLink>
          </div>
        ) : (
          <div className="row mt-5">
            {sortedReports.map((report) => (
              <Card
                key={report.id}
                report={report}
                onDelete={handleDeleteReport}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-4">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${page === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
      <Footer />
    </>
  );
}
