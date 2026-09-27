import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

import VerifyCertificate from "./pages/VerifyCertificate";
import StudentDashboard from "./pages/StudentDashboard";
import StudentLogin from "./pages/StudentLogin";
import CertificateDetails from "./pages/CertificateDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";


function Home() {
  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">

        <div className="logo">
          <div className="logo-icon">✓</div>

          <div>
            <h2>CertiChain</h2>
            <span>Blockchain Credentials</span>
          </div>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">

          <Link
            to="/student-login"
            className="student-nav-button"
          >
            Student Portal
          </Link>

          <Link
            to="/admin-login"
            className="admin-nav-button"
          >
            Admin
          </Link>

          <Link
            to="/verify"
            className="nav-button"
          >
            Verify Certificate
          </Link>

        </div>

      </nav>


      {/* HERO */}
      <section className="hero" id="home">

        <div className="hero-content">

          <div className="badge">
            🔐 Blockchain Powered • Secure & Trusted
          </div>

          <h1>
            Verify Academic Certificates
            <span> Instantly & Securely</span>
          </h1>

          <p>
            A blockchain-based certificate verification platform that
            provides secure, transparent and tamper-resistant academic
            credentials.
          </p>

          <div className="hero-buttons">

            <Link
              to="/verify"
              className="primary-btn"
            >
              🔍 Verify Certificate
            </Link>

            <a
              href="#how"
              className="secondary-btn"
            >
              Learn How It Works →
            </a>

          </div>

          <div className="trust-row">

            <div>
              <strong>100%</strong>
              <small>Secure Records</small>
            </div>

            <div>
              <strong>Instant</strong>
              <small>Verification</small>
            </div>

            <div>
              <strong>24/7</strong>
              <small>Availability</small>
            </div>

          </div>

        </div>


        {/* HERO CARD */}
        <div className="hero-card">

          <div className="card-top">
            <span>Certificate Status</span>

            <span className="verified">
              ● VERIFIED
            </span>
          </div>

          <div className="certificate-icon">
            🏆
          </div>

          <h3>
            Academic Certificate
          </h3>

          <div className="certificate-info">

            <div>
              <span>Certificate ID</span>
              <strong>CERT-2026-001</strong>
            </div>

            <div>
              <span>Student</span>
              <strong>Verified Student</strong>
            </div>

            <div>
              <span>Institution</span>
              <strong>G.H. Raisoni College</strong>
            </div>

          </div>

          <div className="blockchain-status">

            <div className="chain-icon">
              ⛓
            </div>

            <div>
              <strong>
                Blockchain Verified
              </strong>

              <span>
                Certificate hash is authentic
              </span>
            </div>

            <div className="check">
              ✓
            </div>

          </div>

        </div>

      </section>


      {/* FEATURES */}
      <section
        className="features-section"
        id="features"
      >

        <div className="section-heading">

          <span>
            WHY CERTICHAIN?
          </span>

          <h2>
            Built for Trust, Security & Transparency
          </h2>

          <p>
            Our system combines blockchain technology and cryptographic
            verification to protect academic credentials.
          </p>

        </div>


        <div className="features-grid">

          <div className="feature-card">

            <div className="feature-icon">
              🔐
            </div>

            <h3>
              Tamper Resistant
            </h3>

            <p>
              Certificate records are protected using cryptographic
              hashing and blockchain technology.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              ⚡
            </div>

            <h3>
              Instant Verification
            </h3>

            <p>
              Verify certificates within seconds using a certificate
              ID, hash or QR code.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              📱
            </div>

            <h3>
              QR Verification
            </h3>

            <p>
              Scan a certificate QR code to quickly access its
              verification status.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              ⛓️
            </div>

            <h3>
              Blockchain Security
            </h3>

            <p>
              Distributed ledger technology provides transparent and
              trustworthy credential records.
            </p>

          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}
      <section
        className="how-section"
        id="how"
      >

        <div className="section-heading">

          <span>
            HOW IT WORKS
          </span>

          <h2>
            Simple. Secure. Verifiable.
          </h2>

        </div>


        <div className="steps">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <div>
              <h3>
                Issue Certificate
              </h3>

              <p>
                Institution creates and digitally signs the certificate.
              </p>
            </div>

          </div>


          <div className="step">

            <div className="step-number">
              02
            </div>

            <div>
              <h3>
                Generate Hash
              </h3>

              <p>
                A unique cryptographic hash is generated for the credential.
              </p>
            </div>

          </div>


          <div className="step">

            <div className="step-number">
              03
            </div>

            <div>
              <h3>
                Store on Blockchain
              </h3>

              <p>
                Certificate verification data is anchored securely.
              </p>
            </div>

          </div>


          <div className="step">

            <div className="step-number">
              04
            </div>

            <div>
              <h3>
                Verify Certificate
              </h3>

              <p>
                Employers and institutions can instantly verify credentials.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section
        className="cta-section"
        id="about"
      >

        <div>

          <span>
            READY TO VERIFY?
          </span>

          <h2>
            Trust Every Certificate.
          </h2>

          <p>
            Secure academic credentials with blockchain-powered verification.
          </p>

        </div>

        <Link
          to="/verify"
          className="primary-btn"
        >
          Verify Certificate →
        </Link>

      </section>


      {/* FOOTER */}
      <footer>

        <div className="footer-logo">

          <div className="logo-icon">
            ✓
          </div>

          <div>

            <strong>
              CertiChain
            </strong>

            <span>
              Blockchain Certificate Verification
            </span>

          </div>

        </div>

        <p>
          © 2026 CertiChain. Academic Project — G.H. Raisoni College of
          Engineering and Management.
        </p>

      </footer>

    </div>
  );
}


function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* VERIFY */}
        <Route
          path="/verify"
          element={<VerifyCertificate />}
        />

        {/* STUDENT LOGIN */}
        <Route
          path="/student-login"
          element={<StudentLogin />}
        />

        {/* STUDENT */}
        <Route
          path="/student"
          element={<StudentDashboard />}
        />

        {/* CERTIFICATE DETAILS */}
        <Route
          path="/certificate-details"
          element={<CertificateDetails />}
        />

        {/* ADMIN LOGIN */}
        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;