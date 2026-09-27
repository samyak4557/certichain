import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

const API_URL = "https://certichain-f0cn.onrender.com";

function StudentDashboard() {
  const navigate = useNavigate();

  const [certificates, setCertificates] = useState([]);
  const [studentUsername, setStudentUsername] = useState("");
  const [blockchainCount, setBlockchainCount] = useState(0);
  const [loading, setLoading] = useState(true);

  /* =========================
     STUDENT LOGIN PROTECTION
  ========================= */

  useEffect(() => {
    const isLoggedIn =
      localStorage.getItem("studentLoggedIn");

    const username =
      localStorage.getItem("studentUsername");

    if (isLoggedIn !== "true") {
      navigate("/student-login");
      return;
    }

    setStudentUsername(
      username || "student"
    );
  }, [navigate]);


  /* =========================
     LOAD STUDENT DATA
  ========================= */

  useEffect(() => {

    const loadStudentData = async () => {

      try {

        setLoading(true);

        const username =
          localStorage.getItem(
            "studentUsername"
          ) || "student";


        /* =========================
           GET CERTIFICATES
        ========================= */

        const certificateResponse =
          await fetch(
            `${API_URL}/api/certificates`
          );


        if (!certificateResponse.ok) {

          throw new Error(
            "Unable to load certificates"
          );

        }


        const allCertificates =
          await certificateResponse.json();


        const studentCertificates =
          allCertificates.filter(
            (certificate) => {

              if (
                !certificate.studentUsername
              ) {
                return false;
              }

              return (
                certificate.studentUsername ===
                username
              );

            }
          );


        setCertificates(
          studentCertificates
        );


        /* =========================
           GET BLOCKCHAIN RECORDS
        ========================= */

        const blockchainResponse =
          await fetch(
            `${API_URL}/api/blockchain`
          );


        if (blockchainResponse.ok) {

          const blockchainRecords =
            await blockchainResponse.json();


          const studentCertificateIds =
            studentCertificates.map(
              (certificate) =>
                certificate.id
            );


          const studentBlockchainRecords =
            blockchainRecords.filter(
              (block) =>
                studentCertificateIds.includes(
                  block.certificateId
                )
            );


          setBlockchainCount(
            studentBlockchainRecords.length
          );

        }

      } catch (error) {

        console.error(
          "Backend Error:",
          error
        );

        setCertificates([]);
        setBlockchainCount(0);

      } finally {

        setLoading(false);

      }

    };


    loadStudentData();

  }, []);


  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {

    localStorage.removeItem(
      "studentLoggedIn"
    );

    localStorage.removeItem(
      "studentUsername"
    );

    navigate("/student-login");

  };


  /* =========================
     VIEW CERTIFICATE
  ========================= */

  const viewCertificate = (
    certificate
  ) => {

    if (
      !certificate ||
      !certificate.id
    ) {

      console.error(
        "Certificate ID missing:",
        certificate
      );

      return;

    }


    navigate(
      `/certificate-details?id=${encodeURIComponent(
        certificate.id
      )}`
    );

  };


  /* =========================
     COUNTS
  ========================= */

  const verifiedCount =
    certificates.filter(
      (cert) =>
        cert.status !== "Revoked"
    ).length;


  const revokedCount =
    certificates.filter(
      (cert) =>
        cert.status === "Revoked"
    ).length;


  /* =========================
     STUDENT INITIALS
  ========================= */

  const initials =
    studentUsername
      ? studentUsername
          .substring(0, 2)
          .toUpperCase()
      : "ST";


  return (

    <div className="student-dashboard">


      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="student-navbar">

        <div className="student-logo">

          <div className="student-logo-icon">
            ✓
          </div>


          <div className="student-logo-text">

            <strong>
              CertiChain
            </strong>

            <span>
              Student Portal
            </span>

          </div>

        </div>


        <div className="student-nav-links">

          <a href="/">
            Home
          </a>


          <a href="/verify">
            Verify Certificate
          </a>


          <div className="student-profile">

            <div className="profile-avatar">
              {initials}
            </div>


            <div className="profile-info">

              <strong>
                {studentUsername ||
                  "Student"}
              </strong>

              <span>
                Student Account
              </span>

            </div>

          </div>


          <button
            type="button"
            className="student-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* =========================
          MAIN
      ========================= */}

      <main className="student-container">


        {/* =========================
            HERO HEADER
        ========================= */}

        <section className="student-header">

          <div className="student-header-content">

            <div className="student-badge">

              <span className="badge-dot"></span>

              STUDENT PORTAL

            </div>


            <h1>

              Welcome back,

              <span>
                {" "}
                {studentUsername ||
                  "Student"}
              </span>

            </h1>


            <p>

              Manage, view and verify your
              academic certificates securely
              with CertiChain.

            </p>

          </div>


          <button
            className="header-verify-btn"
            onClick={() =>
              navigate("/verify")
            }
          >

            <span>
              ⌕
            </span>

            Verify Certificate

          </button>

        </section>


        {/* =========================
            QUICK INFO
        ========================= */}

        <div className="student-security-bar">


          <div className="security-item">

            <span className="security-icon">
              🔐
            </span>


            <div>

              <strong>
                Secure Credentials
              </strong>

              <small>
                Your certificates are protected
              </small>

            </div>

          </div>


          <div className="security-line"></div>


          <div className="security-item">

            <span className="security-icon">
              ⛓
            </span>


            <div>

              <strong>
                Blockchain Verified
              </strong>

              <small>
                Records are securely maintained
              </small>

            </div>

          </div>


          <div className="security-line"></div>


          <div className="security-item">

            <span className="security-icon">
              ✓
            </span>


            <div>

              <strong>
                Easy Verification
              </strong>

              <small>
                Verify certificates anytime
              </small>

            </div>

          </div>

        </div>


        {/* =========================
            STATISTICS
        ========================= */}

        <section className="student-stats">


          <div className="student-stat-card total-card">

            <div className="stat-top">

              <div className="student-stat-icon">
                📜
              </div>

              <span className="stat-label">
                ALL RECORDS
              </span>

            </div>


            <strong>
              {certificates.length}
            </strong>


            <span className="stat-title">
              Total Certificates
            </span>

          </div>


          <div className="student-stat-card verified-card">

            <div className="stat-top">

              <div className="student-stat-icon">
                ✓
              </div>

              <span className="stat-label">
                ACTIVE
              </span>

            </div>


            <strong>
              {verifiedCount}
            </strong>


            <span className="stat-title">
              Verified Certificates
            </span>

          </div>


          <div className="student-stat-card revoked-card">

            <div className="stat-top">

              <div className="student-stat-icon">
                ×
              </div>

              <span className="stat-label">
                REVOKED
              </span>

            </div>


            <strong>
              {revokedCount}
            </strong>


            <span className="stat-title">
              Revoked Certificates
            </span>

          </div>


          <div className="student-stat-card blockchain-card">

            <div className="stat-top">

              <div className="student-stat-icon">
                ⛓
              </div>

              <span className="stat-label">
                BLOCKCHAIN
              </span>

            </div>


            <strong>
              {blockchainCount}
            </strong>


            <span className="stat-title">
              Blockchain Records
            </span>

          </div>

        </section>


        {/* =========================
            CERTIFICATES SECTION
        ========================= */}

        <section className="student-section">


          <div className="student-section-heading">


            <div>

              <div className="section-small-label">
                CREDENTIALS
              </div>


              <h2>
                My Academic Certificates
              </h2>


              <p>
                View and manage your registered
                academic credentials.
              </p>

            </div>


            <div className="secure-badge">

              <span>
                ✓
              </span>

              Secure Records

            </div>

          </div>


          {/* =========================
              LOADING
          ========================= */}

          {loading ? (

            <div className="student-state-card">

              <div className="loading-icon">
                ⏳
              </div>


              <h3>
                Loading Certificates...
              </h3>


              <p>
                Connecting to CertiChain server.
              </p>

            </div>

          ) : certificates.length === 0 ? (

            /* =========================
               EMPTY STATE
            ========================= */

            <div className="student-state-card">

              <div className="empty-icon">
                📜
              </div>


              <h3>
                No Certificates Found
              </h3>


              <p>
                No certificates are currently
                linked to your student account.
              </p>

            </div>

          ) : (

            /* =========================
               CERTIFICATE LIST
            ========================= */

            <div className="student-certificate-list">


              {certificates.map(
                (certificate) => {

                  const isRevoked =
                    certificate.status ===
                    "Revoked";


                  return (

                    <article
                      className={
                        isRevoked
                          ? "student-certificate-card revoked-certificate-card"
                          : "student-certificate-card"
                      }
                      key={certificate.id}
                    >


                      <div className="certificate-main">


                        <div className="certificate-icon">
                          📜
                        </div>


                        <div className="student-certificate-info">


                          <div className="certificate-id">
                            {certificate.id}
                          </div>


                          <h3>
                            {certificate.course}
                          </h3>


                          <p>
                            {certificate.certificateType ||
                              "Academic Certificate"}
                          </p>


                          <div className="certificate-meta">


                            <span>

                              <b>
                                Issued:
                              </b>{" "}

                              {certificate.issueDate}

                            </span>


                            <span>

                              <b>
                                Status:
                              </b>{" "}


                              <strong
                                className={
                                  isRevoked
                                    ? "student-revoked"
                                    : "student-verified"
                                }
                              >

                                {isRevoked
                                  ? "✕ Revoked"
                                  : "✓ Verified"}

                              </strong>

                            </span>


                          </div>

                        </div>

                      </div>


                      <div className="certificate-card-action">


                        <button
                          type="button"
                          className="view-certificate-btn"
                          onClick={() =>
                            viewCertificate(
                              certificate
                            )
                          }
                        >

                          View Certificate

                          <span>
                            →
                          </span>

                        </button>


                      </div>


                    </article>

                  );

                }
              )}

            </div>

          )}

        </section>

      </main>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="student-footer">


        <div className="footer-brand">

          <span>
            ✓
          </span>

          CertiChain

        </div>


        <p>
          Blockchain-Based Certificate Verification System
        </p>


        <small>
          © 2026 CertiChain · Secure Academic Credentials
        </small>


      </footer>


    </div>

  );
}

export default StudentDashboard;