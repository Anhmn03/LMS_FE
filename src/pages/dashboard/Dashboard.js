import React, { useState } from "react";
import { Container, Row, Col, Card, Navbar, Nav } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import {
  FaBars,
  FaHome,
  FaBook,
  FaTasks,
  FaCalendar,
  FaComments,
  FaCog,
} from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <img
            src="/images/OIP.jpg"
            alt="Oxford Logo"
            className="sidebar-logo"
          />
          {sidebarOpen && (
            <div className="user-info">
              <img
                src="/images/OIP.jpg"
                alt="User Avatar"
                className="user-avatar"
              />
              <span className="user-name">{user?.fullName || "Alex"}</span>
            </div>
          )}
        </div>
        <Nav className="flex-column sidebar-nav">
          <Nav.Link href="/student/dashboard" className="sidebar-link">
            <FaHome className="sidebar-icon" />
            {sidebarOpen && <span>Home</span>}
          </Nav.Link>
          <Nav.Link href="/student/mycourses" className="sidebar-link">
            <FaBook className="sidebar-icon" />
            {sidebarOpen && <span>My Courses</span>}
          </Nav.Link>
          <Nav.Link href="/student/assignments" className="sidebar-link">
            <FaTasks className="sidebar-icon" />
            {sidebarOpen && <span>Assignments</span>}
          </Nav.Link>
          <Nav.Link href="/student/timetable" className="sidebar-link">
            <FaCalendar className="sidebar-icon" />
            {sidebarOpen && <span>Time Table</span>}
          </Nav.Link>
          <Nav.Link href="/student/forum" className="sidebar-link">
            <FaComments className="sidebar-icon" />
            {sidebarOpen && <span>Forum</span>}
          </Nav.Link>
          <Nav.Link href="/student/settings" className="sidebar-link">
            <FaCog className="sidebar-icon" />
            {sidebarOpen && <span>Settings</span>}
          </Nav.Link>
        </Nav>
      </div>

      <div className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
        <Navbar bg="light" className="dashboard-navbar">
          <FaBars className="hamburger-icon" onClick={toggleSidebar} />
          <Navbar.Brand className="ms-3">Dashboard</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link href="#notifications">
              <FaComments />
            </Nav.Link>
          </Nav>
        </Navbar>

        <Container fluid className="pt-4">
          <h2>Welcome Back, {user?.fullName || "Alex"}</h2>
          <Card className="program-card mt-4">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h3>
                  Oxford Scholarships for PhD (DPhil) in Biology, 2023-24,
                  University of Oxford, UK
                </h3>
                <p>Application Deadline: 30 January 2023</p>
              </div>
              <div className="d-flex align-items-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_the_United_Kingdom.svg"
                  alt="UK Flag"
                  className="flag-icon me-2"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/4/43/Oxford_University_Logo.svg/1200px-Oxford_University_Logo.svg.png"
                  alt="Oxford Biology Logo"
                  className="program-logo"
                />
              </div>
            </Card.Body>
          </Card>

          <Row className="mt-4">
            <Col md={4}>
              <Card className="certificate-card">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <FaBook className="certificate-icon me-2" />
                    <div>
                      <h5>Diploma in English</h5>
                      <p>OXF/ENG/001</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="certificate-card">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <FaBook className="certificate-icon me-2" />
                    <div>
                      <h5>Diploma in IT</h5>
                      <p>OXF/IT/001</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="certificate-card">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <FaBook className="certificate-icon me-2" />
                    <div>
                      <h5>HND in Computing</h5>
                      <p>OXF/HND/001</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={6}>
              <Card className="progress-card">
                <Card.Body>
                  <h5>Module Progress: 90%</h5>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: "90%" }}
                      aria-valuenow="90"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="progress-card">
                <Card.Body>
                  <h5>Assignment Progress: 10%</h5>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: "10%" }}
                      aria-valuenow="10"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={6}>
              <Card className="progress-card">
                <Card.Body>
                  <h5>Attendance Progress: 97%</h5>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: "97%" }}
                      aria-valuenow="97"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="progress-card">
                <Card.Body>
                  <h5>Course Progress: 50%</h5>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: "50%" }}
                      aria-valuenow="50"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
