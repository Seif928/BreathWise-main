import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

function Footer() {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">About Us</h5>
            <p>
              We are dedicated to providing the best healthcare solutions through
              innovative technology and expert medical analysis.
            </p>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/home" className="text-white text-decoration-none">
                  <i className="fas fa-home me-2"></i>
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/upload" className="text-white text-decoration-none">
                  <i className="fas fa-upload me-2"></i>
                  Upload Report
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/myreports" className="text-white text-decoration-none">
                  <i className="fas fa-file-medical me-2"></i>
                  My Reports
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">Ideas</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/health-info" className="text-white text-decoration-none">
                  <i className="fas fa-lightbulb me-2"></i>
                  Health Tips
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/health-info" className="text-white text-decoration-none">
                  <i className="fas fa-book-medical me-2"></i>
                  Medical Articles
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/health-info" className="text-white text-decoration-none">
                  <i className="fas fa-heartbeat me-2"></i>
                  Wellness Guide
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/health-info" className="text-white text-decoration-none">
                  <i className="fas fa-brain me-2"></i>
                  Mental Health
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/health-info" className="text-white text-decoration-none">
                  <i className="fas fa-dumbbell me-2"></i>
                  Fitness Tips
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="fas fa-envelope me-2"></i>
                info@healthcare.com
              </li>
              <li className="mb-2">
                <i className="fas fa-phone me-2"></i>
                +1 234 567 890
              </li>
              <li className="mb-2">
                <i className="fas fa-map-marker-alt me-2"></i>
                123 Healthcare St, Medical City
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4" />

        <div className="text-center">
          <p className="mb-0">
            © {new Date().getFullYear()} Healthcare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 