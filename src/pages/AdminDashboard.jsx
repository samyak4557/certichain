import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const API_URL = "http://10.11.113.49:5000";

function AdminDashboard() {
  const navigate = useNavigate();

  const defaultCertificates = [
    {
      id: "CERT-2026-001",
      studentName: "Rahul Sharma",
      studentUsername: "student",
      course: "B.Sc. Computer Science",
      certificateType: "Degree Certificate",
      issueDate: "15 Aug 2026",
      hash: "8f42a9c71d5e91cd7a42f8b3",
      status: "Verified",
    },
    {
      id: "CERT-2026-002",
      studentName: "Priya Patil",
      studentUsername: "student",
      course: "Web Development",
      certificateType: "Professional Certificate",
      issueDate: "20 Aug 2026",
      hash: "4b72d91c8e53a17f6d92b41e",
      status: "Verified",
    },
    {
      id: "CERT-2026-003",
      studentName: "Arjun More",
      studentUsername: "student",
      course: "Data Analytics",
      certificateType: "Skill Certificate",
      issueDate: "25 Aug 2026",
      hash: "9c31e74a52f8d61b3e94c27a",
      status: "Verified",
    },
  ];

  const [certificates, setCertificates] =
    useState(defaultCertificates);

  const [blockchainRecords, setBlockchainRecords] =
    useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [certificate, setCertificate] =
    useState({
      studentName: "",
      studentUsername: "student",
      course: "",
      certificateType: "Degree Certificate",
      issueDate: "",
    });

  // =========================
  // ADMIN PROTECTION
  // =========================

  useEffect(() => {
    const isLoggedIn =
      localStorage.getItem("adminLoggedIn");

    if (isLoggedIn !== "true") {
      navigate("/admin-login");
    }
  }, [navigate]);

  // =========================
  // LOAD BACKEND DATA
  // =========================

  useEffect(() => {
    loadCertificates();
    loadBlockchainRecords();
  }, []);

  const loadCertificates = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/certificates`
      );

      if (!response.ok) {
        throw new Error("Certificate server error");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setCertificates(data);
      }
    } catch (error) {
      console.error(
        "Unable to load certificates:",
        error
      );
    }
  };

  const loadBlockchainRecords = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/blockchain`
      );

      if (!response.ok) {
        throw new Error("Blockchain server error");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setBlockchainRecords(data);
      }
    } catch (error) {
      console.error(
        "Unable to load blockchain records:",
        error
      );
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin-login");
  };

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setCertificate({
      ...certificate,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // GENERATE HASH
  // =========================

  const generateHash = (text) => {
    let hash = 0;

    for (let i = 0; i < text.length; i++) {
      hash =
        (hash << 5) -
        hash +
        text.charCodeAt(i);

      hash |= 0;
    }

    return Math.abs(hash)
      .toString(16)
      .padStart(24, "0")
      .substring(0, 24);
  };
// =========================
// ISSUE CERTIFICATE
// =========================

const issueCertificate = async (e) => {
  e.preventDefault();

  if (
    !certificate.studentName.trim() ||
    !certificate.studentUsername.trim() ||
    !certificate.course.trim() ||
    !certificate.issueDate
  ) {
    alert("Please fill all required fields!");
    return;
  }

  try {
    // =========================
    // LOAD ALL CERTIFICATES
    // =========================

    const certificatesResponse = await fetch(
      `${API_URL}/api/certificates`
    );

    if (!certificatesResponse.ok) {
      throw new Error(
        "Unable to load certificates."
      );
    }

    const currentCertificates =
      await certificatesResponse.json();

    // =========================
    // GENERATE UNIQUE CERTIFICATE ID
    // =========================

    const usedNumbers = currentCertificates
      .map((cert) => {
        const match = String(cert.id).match(
          /CERT-2026-(\d+)/
        );

        return match
          ? parseInt(match[1], 10)
          : 0;
      })
      .filter((num) => !isNaN(num));

    let nextNumber =
      usedNumbers.length > 0
        ? Math.max(...usedNumbers) + 1
        : 1;

    let certificateId =
      "CERT-2026-" +
      String(nextNumber).padStart(3, "0");

    // Extra safety check
    while (
      currentCertificates.some(
        (cert) =>
          String(cert.id).toUpperCase() ===
          certificateId.toUpperCase()
      )
    ) {
      nextNumber++;

      certificateId =
        "CERT-2026-" +
        String(nextNumber).padStart(3, "0");
    }

    // =========================
    // GENERATE HASH
    // =========================

    const hashInput =
      certificate.studentName.trim() +
      certificate.studentUsername.trim() +
      certificate.course.trim() +
      certificate.certificateType +
      certificate.issueDate +
      certificateId;

    const certificateHash =
      generateHash(hashInput);

    // =========================
    // CREATE CERTIFICATE
    // =========================

    const newCertificate = {
      id: certificateId,

      studentName:
        certificate.studentName.trim(),

      studentUsername:
        certificate.studentUsername.trim(),

      course:
        certificate.course.trim(),

      certificateType:
        certificate.certificateType,

      issueDate:
        new Date(
          certificate.issueDate
        ).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        ),

      hash: certificateHash,

      status: "Verified",

      institution:
        "G.H. Raisoni College of Engineering and Management",
    };

    // =========================
    // SAVE CERTIFICATE
    // =========================

    const certificateSaveResponse =
      await fetch(
        `${API_URL}/api/certificates`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            newCertificate
          ),
        }
      );

    if (!certificateSaveResponse.ok) {
      const errorData =
        await certificateSaveResponse.json();

      throw new Error(
        errorData.message ||
          "Certificate could not be saved."
      );
    }

    // =========================
    // SAVE BLOCKCHAIN RECORD
    // =========================

    const blockchainSaveResponse =
      await fetch(
        `${API_URL}/api/blockchain`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            certificateId:
              newCertificate.id,

            certificateHash:
              newCertificate.hash,
          }),
        }
      );

    if (!blockchainSaveResponse.ok) {
      const errorData =
        await blockchainSaveResponse.json();

      throw new Error(
        errorData.message ||
          "Blockchain record could not be saved."
      );
    }

    const blockchainResult =
      await blockchainSaveResponse.json();

    const newBlock =
      blockchainResult.block;

    // =========================
    // UPDATE UI
    // =========================

    const updatedCertificates = [
      ...currentCertificates,
      newCertificate,
    ];

    const updatedBlockchainRecords = [
      ...blockchainRecords,
      newBlock,
    ];

    setCertificates(
      updatedCertificates
    );

    setBlockchainRecords(
      updatedBlockchainRecords
    );

    // =========================
    // LOCAL STORAGE
    // =========================

    localStorage.setItem(
      "certificates",
      JSON.stringify(
        updatedCertificates
      )
    );

    localStorage.setItem(
      "blockchainRecords",
      JSON.stringify(
        updatedBlockchainRecords
      )
    );

    // =========================
    // SUCCESS MESSAGE
    // =========================

    alert(
      "Certificate issued successfully!\n\n" +
      "Certificate ID: " +
      newCertificate.id +
      "\n\n" +
      "Blockchain Block: #" +
      newBlock.blockNumber
    );

    // =========================
    // RESET FORM
    // =========================

    setCertificate({
      studentName: "",
      studentUsername: "student",
      course: "",
      certificateType:
        "Degree Certificate",
      issueDate: "",
    });

    setShowForm(false);

    // Refresh data
    loadCertificates();
    loadBlockchainRecords();

  } catch (error) {
    console.error(
      "Issue Certificate Error:",
      error
    );

    alert(
      "Unable to save certificate.\n\n" +
      error.message +
      "\n\n" +
      "Please make sure the backend server is running."
    );
  }
};

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredCertificates =
    certificates.filter((cert) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        cert.id
          .toLowerCase()
          .includes(searchText) ||
        cert.studentName
          .toLowerCase()
          .includes(searchText) ||
        (cert.studentUsername || "")
          .toLowerCase()
          .includes(searchText) ||
        cert.course
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        cert.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // =========================
  // STATS
  // =========================

  const verifiedCount =
    certificates.filter(
      (cert) =>
        cert.status === "Verified"
    ).length;

  const revokedCount =
    certificates.filter(
      (cert) =>
        cert.status === "Revoked"
    ).length;

  // =========================
  // VIEW CERTIFICATE
  // =========================

  const viewCertificate = (cert) => {
    navigate(
      `/certificate-details?id=${encodeURIComponent(
        cert.id
      )}`,
      {
        state: {
          certificate: cert,
        },
      }
    );
  };

  // =========================
  // REVOKE CERTIFICATE
  // =========================

  const revokeCertificate = async (
    certificateId
  ) => {
    const confirmRevoke =
      window.confirm(
        "Are you sure you want to revoke this certificate?"
      );

    if (!confirmRevoke) {
      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/api/certificates/${encodeURIComponent(
            certificateId
          )}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              status: "Revoked",
            }),
          }
        );

      if (!response.ok) {
        const errorData =
          await response.json();

        throw new Error(
          errorData.message ||
            "Certificate revoke failed."
        );
      }

      const updatedCertificates =
        certificates.map((cert) =>
          cert.id === certificateId
            ? {
                ...cert,
                status: "Revoked",
              }
            : cert
        );

      setCertificates(
        updatedCertificates
      );

      localStorage.setItem(
        "certificates",
        JSON.stringify(
          updatedCertificates
        )
      );

      alert(
        "Certificate has been revoked successfully."
      );

    } catch (error) {
      console.error(error);

      alert(
        "Unable to revoke certificate.\n\n" +
        error.message
      );
    }
  };

  return (
    <div className="admin-dashboard">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="admin-navbar">

        <div className="admin-logo">

          <div className="admin-logo-icon">
            ✓
          </div>

          <div>
            <strong>
              CertiChain
            </strong>

            <span>
              College Administration
            </span>
          </div>

        </div>

        <div className="admin-nav-links">

          <a href="/">
            Home
          </a>

          <a href="/verify">
            Verify Certificate
          </a>

          <span className="admin-profile">
            Admin
          </span>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* =========================
          MAIN
      ========================= */}

      <main className="admin-container">

        {/* HEADER */}

        <div className="admin-header">

          <div>

            <div className="admin-badge">
              COLLEGE ADMINISTRATION
            </div>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Manage, issue and verify academic
              certificates securely.
            </p>

          </div>

          <button
            type="button"
            className="issue-btn"
            onClick={() =>
              setShowForm(true)
            }
          >
            <span className="issue-btn-icon">
              +
            </span>
            Issue Certificate
          </button>

        </div>

        {/* =========================
            STATS
        ========================= */}

        <div className="admin-stats">

          <div className="admin-stat-card">

            <div className="stat-icon">
              📜
            </div>

            <div>
              <span>
                Total Certificates
              </span>

              <strong>
                {certificates.length}
              </strong>
            </div>

          </div>

          <div className="admin-stat-card">

            <div className="stat-icon verified-icon">
              ✓
            </div>

            <div>
              <span>
                Verified
              </span>

              <strong>
                {verifiedCount}
              </strong>
            </div>

          </div>

          <div className="admin-stat-card">

            <div className="stat-icon blockchain-icon">
              ⛓
            </div>

            <div>
              <span>
                Blockchain Records
              </span>

              <strong>
                {blockchainRecords.length}
              </strong>
            </div>

          </div>

          <div className="admin-stat-card">

            <div className="stat-icon revoked-icon">
              !
            </div>

            <div>
              <span>
                Revoked
              </span>

              <strong>
                {revokedCount}
              </strong>
            </div>

          </div>

        </div>

        {/* =========================
            CERTIFICATE MANAGEMENT
        ========================= */}

        <section className="admin-section">

          <div className="section-heading">

            <div>

              <div className="section-label">
                CERTIFICATE DATABASE
              </div>

              <h2>
                Certificate Management
              </h2>

              <p>
                Search and manage issued academic
                credentials.
              </p>

            </div>

            <div className="record-count">
              {filteredCertificates.length} Records
            </div>

          </div>

          {/* SEARCH CONTROLS */}

          <div className="certificate-controls">

            <div className="search-wrapper">

              <span className="search-icon">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search by ID, student, username or course..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  ×
                </button>
              )}

            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >

              <option value="All">
                All Status
              </option>

              <option value="Verified">
                Verified
              </option>

              <option value="Revoked">
                Revoked
              </option>

            </select>

          </div>

          {/* TABLE */}

          <div className="certificate-table">

            <div className="table-header">

              <span>
                Certificate ID
              </span>

              <span>
                Student
              </span>

              <span>
                Username
              </span>

              <span>
                Course
              </span>

              <span>
                Issue Date
              </span>

              <span>
                Status
              </span>

              <span>
                Actions
              </span>

            </div>

            {filteredCertificates.length > 0 ? (

              filteredCertificates.map(
                (cert) => (

                  <div
                    className="table-row"
                    key={cert.id}
                  >

                    <span className="certificate-id-cell">
                      {cert.id}
                    </span>

                    <strong>
                      {cert.studentName}
                    </strong>

                    <span>
                      {cert.studentUsername ||
                        "student"}
                    </span>

                    <span>
                      {cert.course}
                    </span>

                    <span>
                      {cert.issueDate}
                    </span>

                    <b
                      className={
                        cert.status === "Revoked"
                          ? "revoked-status"
                          : "verified-status"
                      }
                    >
                      {cert.status === "Revoked"
                        ? "✕ Revoked"
                        : "✓ Verified"}
                    </b>

                    <div className="action-buttons">

                      <button
                        type="button"
                        className="view-certificate-btn"
                        onClick={() =>
                          viewCertificate(cert)
                        }
                      >
                        View
                      </button>

                      {cert.status !==
                        "Revoked" && (

                        <button
                          type="button"
                          className="revoke-certificate-btn"
                          onClick={() =>
                            revokeCertificate(
                              cert.id
                            )
                          }
                        >
                          Revoke
                        </button>

                      )}

                    </div>

                  </div>

                )
              )

            ) : (

              <div className="no-certificates">

                <div className="empty-icon">
                  ⌕
                </div>

                <strong>
                  No certificates found
                </strong>

                <span>
                  Try changing your search or
                  status filter.
                </span>

              </div>

            )}

          </div>

        </section>

        {/* =========================
            BLOCKCHAIN STATUS
        ========================= */}

        <div className="blockchain-status">

          <div className="blockchain-status-icon">
            ⛓
          </div>

          <div className="blockchain-status-content">

            <div className="blockchain-title-row">

              <strong>
                Blockchain Network
              </strong>

              <span className="online-status">
                <i></i>
                Network Online
              </span>

            </div>

            <p>
              Certificate records are securely linked
              using SHA-256 hash verification.
            </p>

          </div>

        </div>

        {/* =========================
            BLOCKCHAIN RECORDS
        ========================= */}

        <section className="admin-section blockchain-section">

          <div className="section-heading">

            <div>

              <div className="section-label">
                BLOCKCHAIN LEDGER
              </div>

              <h2>
                Blockchain Records
              </h2>

              <p>
                View certificate blocks and their
                cryptographic verification details.
              </p>

            </div>

            <div className="record-count blockchain-count">
              {blockchainRecords.length} Blocks
            </div>

          </div>

          <div className="blockchain-records">

            {blockchainRecords.length > 0 ? (

              blockchainRecords
                .slice()
                .reverse()
                .map((block) => (

                  <div
                    className="blockchain-record-card"
                    key={
                      block.blockNumber ||
                      block.id ||
                      block.blockHash
                    }
                  >

                    <div className="block-top">

                      <div className="block-number">

                        <span>
                          BLOCK
                        </span>

                        <strong>
                          #{block.blockNumber}
                        </strong>

                      </div>

                      <span className="block-confirmed">
                        ✓ Confirmed
                      </span>

                    </div>

                    <div className="block-details">

                      <div className="block-detail">

                        <span>
                          Certificate ID
                        </span>

                        <strong>
                          {block.certificateId}
                        </strong>

                      </div>

                      <div className="block-detail">

                        <span>
                          Status
                        </span>

                        <strong>
                          {block.status || "Verified"}
                        </strong>

                      </div>

                      <div className="block-detail full-detail">

                        <span>
                          Certificate Hash
                        </span>

                        <code>
                          {block.certificateHash}
                        </code>

                      </div>

                      <div className="block-detail full-detail">

                        <span>
                          Previous Hash
                        </span>

                        <code>
                          {block.previousHash}
                        </code>

                      </div>

                      <div className="block-detail full-detail">

                        <span>
                          Block Hash
                        </span>

                        <code>
                          {block.blockHash}
                        </code>

                      </div>

                      {block.timestamp && (

                        <div className="block-detail">

                          <span>
                            Timestamp
                          </span>

                          <strong>
                            {new Date(
                              block.timestamp
                            ).toLocaleString()}
                          </strong>

                        </div>

                      )}

                    </div>

                  </div>

                ))

            ) : (

              <div className="no-certificates">

                <div className="empty-icon">
                  ⛓
                </div>

                <strong>
                  No blockchain records
                </strong>

                <span>
                  Blockchain records will appear here
                  after issuing a certificate.
                </span>

              </div>

            )}

          </div>

        </section>

      </main>

      {/* =========================
          ISSUE CERTIFICATE MODAL
      ========================= */}

      {showForm && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowForm(false)
          }
        >

          <div
            className="issue-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              type="button"
              className="close-modal"
              onClick={() =>
                setShowForm(false)
              }
            >
              ×
            </button>

            <div className="modal-icon">
              +
            </div>

            <div className="modal-badge">
              CERTIFICATE ISSUANCE
            </div>

            <h2>
              Issue New Certificate
            </h2>

            <p>
              Enter the student and certificate
              details below to create a new
              blockchain-backed credential.
            </p>

            <form
              onSubmit={issueCertificate}
            >

              <label htmlFor="studentName">
                Student Name
              </label>

              <input
                id="studentName"
                type="text"
                name="studentName"
                placeholder="Enter student full name"
                value={
                  certificate.studentName
                }
                onChange={handleChange}
                required
              />

              <label htmlFor="studentUsername">
                Student Username
              </label>

              <input
                id="studentUsername"
                type="text"
                name="studentUsername"
                placeholder="Enter student username"
                value={
                  certificate.studentUsername
                }
                onChange={handleChange}
                required
              />

              <small className="field-help">
                This username is used by the student
                to access the certificate dashboard.
              </small>

              <label htmlFor="course">
                Course
              </label>

              <input
                id="course"
                type="text"
                name="course"
                placeholder="Enter course name"
                value={
                  certificate.course
                }
                onChange={handleChange}
                required
              />

              <label htmlFor="certificateType">
                Certificate Type
              </label>

              <select
                id="certificateType"
                name="certificateType"
                value={
                  certificate.certificateType
                }
                onChange={handleChange}
              >

                <option value="Degree Certificate">
                  Degree Certificate
                </option>

                <option value="Professional Certificate">
                  Professional Certificate
                </option>

                <option value="Skill Certificate">
                  Skill Certificate
                </option>

                <option value="Course Completion Certificate">
                  Course Completion Certificate
                </option>

              </select>

              <label htmlFor="issueDate">
                Issue Date
              </label>

              <input
                id="issueDate"
                type="date"
                name="issueDate"
                value={
                  certificate.issueDate
                }
                onChange={handleChange}
                required
              />

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-certificate-btn"
                >
                  Issue Certificate
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="admin-footer">

        <strong>
          CertiChain
        </strong>

        <span>
          © 2026 G.H. Raisoni College of Engineering
          and Management
        </span>

      </footer>

    </div>
  );
}

export default AdminDashboard;