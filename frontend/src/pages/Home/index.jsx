import "./style.css";
import Footer from "./../../components/Footer";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      {/* Hero Section with Animated AI Visualization */}
      <div className="position-relative w-100 vh-100 overflow-hidden hero-ai-container">
        <div className="hero-background-animation"></div>
        <div className="hero-grid-overlay"></div>

        <div className="diagnostic-hud position-absolute top-0 start-0 w-100 h-100 p-4">
          <div className="hud-corner top-left"></div>
          <div className="hud-corner top-right"></div>
          <div className="hud-corner bottom-left"></div>
          <div className="hud-corner bottom-right"></div>

          <div className="hud-data-scout position-absolute top-10 start-10">
            <div className="pulse-text mb-2">SCANNING_DATA_STREAMS...</div>
            <div className="data-bar"><div className="data-fill fill-1"></div></div>
            <div className="data-bar"><div className="data-fill fill-2"></div></div>
          </div>
        </div>

        <div
          className="position-relative z-2 d-flex flex-column justify-content-center align-items-center text-center text-white h-100 p-4 hero-content"
        >
          <div className="ai-badge mb-3">
            <i className="fas fa-brain me-2"></i> PURE-AI DIAGNOSTICS
          </div>
          <p className="d-flex justify-content-around fs-1 welcome-text mb-0">WELCOME TO</p>
          <h1 className="display-2 fw-bold mb-4 primary-title">LungDx AI Analysis</h1>
          <p className="fs-5 w-50 mx-auto mb-5 text-light opacity-75">
            Revolutionizing pulmonary healthcare through state-of-the-art
            artificial intelligence and deep learning diagnostics.
          </p>

          <HashLink
            to={"/upload/#to-upload"}
            smooth
            className="btn btn-primary px-5 py-3 fs-5 fw-bolder mt-3 call-to-action"
          >
            Launch Analysis Console
          </HashLink>

          <div className="scroll-indicator pt-5 mt-5">
            <a href="#About" className="text-white opacity-50">
              <i className="fas fa-chevron-down fs-4"></i>
            </a>
          </div>
        </div>
      </div>

      <div id="About" className="pt-1 bg-light"></div>
      <section className="bg-light rounded-5 container my-5 about-section">
        <div className="wm">
          <div className="abh2">
            <h2 className="">About</h2>
          </div>
          <div className="content mt-3 about-content">
            <h2>AI-Powered Pulmonary Disease Detection</h2>
            <p>
              Our advanced AI system is transforming lung health diagnostics by
              analyzing chest X-ray images with unmatched speed and precision.
            </p>
            <p>
              We focus on the early detection of critical pulmonary conditions,
              empowering both patients and healthcare providers to make
              informed, timely decisions.
            </p>
            <h4>Diseases We Detect:</h4>
            <ul className="disease-list">
              <li>
                <Link to="/diseases/pneumonia" className="text-decoration-none text-dark hover-lift">
                  <i className="fas fa-lungs me-2"></i>
                  Pneumonia
                </Link>
              </li>
              <li>
                <Link to="/diseases/lung-opacity" className="text-decoration-none text-dark hover-lift">
                  <i className="fas fa-cloud me-2"></i>
                  Lung Opacity
                </Link>
              </li>
              <li>
                <Link to="/diseases/pneumothorax" className="text-decoration-none text-dark hover-lift">
                  <i className="fas fa-lungs-virus me-2"></i>
                  Pneumothorax (Collapsed Lung)
                </Link>
              </li>
              <li>
                <Link to="/diseases/pleural-effusion" className="text-decoration-none text-dark hover-lift">
                  <i className="fas fa-tint me-2"></i>
                  Pleural Effusion (Fluid Around the Lungs)
                </Link>
              </li>
            </ul>
          </div>
          <div className="vd mt-5 video-container position-relative overflow-hidden rounded-4 shadow-lg scan-container">
            <img
              src="/chest.png"
              alt="AI X-ray Analysis"
              className="img-fluid w-100 h-100 object-fit-cover"
            />
            <div className="scan-line"></div>
            <div className="scan-overlay d-flex justify-content-center align-items-center">
              <span className="badge bg-primary px-3 py-2 diagnostic-tag">
                <i className="fas fa-microchip me-2"></i>
                AI Analysis Active...
              </span>
            </div>
          </div>
          <div className="clr"></div>
        </div>
      </section>

      <div className="container shadow py-5 rounded-5">
        <h2 className="text-center fw-bold hero-title d-flex justify-content-center">What is X-ray AI Read?</h2>
        <p className="text-center w-75 my-5 mx-auto about-content">
          X-ray AI Read is an advanced feature of CT Read that uses artificial
          intelligence to analyze and interpret X-ray images. It provides quick,
          accurate insights into X-ray scans, making them understandable for
          non-medical users.
        </p>
        <div className="row gx-5 container-fluid gy-5">
          <div className="col-md-6 bbbb">
            <div className="row container-fluid feature-card">
              <div className="col-3 justify-content-center d-flex align-items-center">
                <i className="fa-solid text-warning fa-bolt fs-1 p-3 rounded-3 feature-icon"></i>
              </div>
              <div className="col-9 ">
                <h3>Instant Results</h3>
                <p>
                  Get analysis results within seconds of uploading your X-ray
                  image.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row container-fluid feature-card">
              <div className="col-3 justify-content-center d-flex align-items-center">
                <i className="fa-solid text-primary fa-brain fs-1 p-3 rounded-3 feature-icon"></i>
              </div>
              <div className="col-9 ">
                <h3>AI-Powered Analysis</h3>
                <p>
                  Utilizes cutting-edge AI algorithms to interpret X-ray images
                  with high accuracy.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row container-fluid feature-card">
              <div className="col-3 justify-content-center d-flex align-items-center">
                <i className="fa-regular purble fa-file-lines fs-1 p-3 rounded-3 feature-icon"></i>
              </div>
              <div className="col-9">
                <h3>Easy to Understand</h3>
                <p>
                  Receive clear, jargon-free explanations of your X-ray
                  findings.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row container-fluid feature-card">
              <div className="col-3 justify-content-center d-flex align-items-center">
                <i className="fa-solid text-danger fa-magnifying-glass fs-1 p-3 rounded-3 feature-icon"></i>
              </div>
              <div className="col-9">
                <h3>Early Detection</h3>
                <p>Can identify subtle abnormalities that might be missed.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5 pt-5 rounded-4 shadow py-5 ">
        <h2 className="text-center fw-bold mb-5 hero-title d-flex justify-content-center">
          Key Features of X-ray AI Read
        </h2>

        <div className="row gx-5 container-fluid gy-5">
          <div className="col-md-6">
            <div className="row container-fluid feature-card">
              <div className="col-3 justify-content-center d-flex align-items-center">
                <i className="fa-solid text-warning fa-bolt fs-1 p-3 rounded-3 feature-icon"></i>
              </div>
              <div className="col-9">
                <h3>Multi-Image Support</h3>
                <p>
                  Analyze various types of X-rays including chest X-rays, bone
                  X-rays, dental X-rays, abdominal X-rays, and more. Our AI is
                  trained on a diverse dataset to provide accurate insights
                  across different X-ray types.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row container-fluid feature-card">
              <div className="col-3 justify-content-center d-flex align-items-center">
                <i className="text-primary fa-solid fa-shield fs-1 p-3 rounded-3 feature-icon"></i>
              </div>
              <div className="col-9">
                <h3>Rapid Analysis</h3>
                <p>
                  Get instant AI analysis of your X-ray images within seconds,
                  significantly reducing wait times for initial insights.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row container-fluid feature-card">
              <div className="col-3 justify-content-center d-flex align-items-center">
                <i className="text-success fs-1 p-3 rounded-3 fa-solid fa-signal feature-icon"></i>
              </div>
              <div className="col-9">
                <h3>High Accuracy</h3>
                <p>
                  Benefit from our advanced AI algorithms trained on vast
                  datasets of X-ray images, providing high-accuracy
                  interpretations to support clinical decision-making.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row container-fluid feature-card">
              <div className="col-3 justify-content-center d-flex align-items-center">
                <i className="purble fa-solid fa-layer-group fs-1 p-3 rounded-3 feature-icon"></i>
              </div>
              <div className="col-9">
                <h3>Comprehensive Reports</h3>
                <p>
                  Receive detailed, easy-to-understand reports highlighting
                  areas of interest, potential abnormalities, and suggested
                  follow-up actions.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row container-fluid feature-card">
              <div className="col-3 justify-content-center d-flex align-items-center">
                <i className="text-danger fs-1 p-3 rounded-3 fa-solid fa-lock feature-icon"></i>
              </div>
              <div className="col-9">
                <h3>Secure and Private</h3>
                <p>
                  Your X-ray images are processed with the highest standards of
                  data security and privacy. We use encryption and follow strict
                  data protection regulations.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row container-fluid feature-card">
              <div className="col-3 justify-content-center d-flex align-items-center">
                <i className="purble fa-solid fa-repeat fs-1 p-3 rounded-3 feature-icon"></i>
              </div>
              <div className="col-9">
                <h3>Continuous Learning</h3>
                <p>
                  Our AI model is continuously updated with the latest medical
                  research and imaging techniques, ensuring you always have
                  access to state-of-the-art X-ray analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
