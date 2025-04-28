import React, { useState, useEffect } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import {
  FaBars,
  FaHome,
  FaBook,
  FaChalkboardTeacher,
  FaCog,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Settings from "../../components/teacher-dashboard/Settings";
import MyCourses from "../../components/teacher-dashboard/MyCourses";
import "./Dashboard.css";
import { useAuth } from "../../context/AuthContext";
import { TeacherProvider } from "../../context/TeacherContext";

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (path === "teacher" || path === "dashboard") {
      setActiveView("dashboard");
    } else if (["mycourses", "lectures", "settings"].includes(path)) {
      setActiveView(path);
    }
  }, [location]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigation = (view) => {
    setActiveView(view);
    navigate(view === "dashboard" ? "/teacher/dashboard" : `/teacher/${view}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const renderContent = () => {
    switch (activeView) {
      case "mycourses":
        return <MyCourses />;
      case "lectures":
        return <div>Lectures content will be implemented here</div>;
      case "settings":
        return <Settings />;
      case "dashboard":
      default:
        return (
          <>
            <h2>Welcome Back, {user?.fullName || "Teacher"}</h2>
            <div className="program-card mt-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3>Teacher Dashboard</h3>
                  <p>Academic Year: 2025-2026</p>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <TeacherProvider>
      <div className="dashboard-container">
        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-header">
            <img src="/images/OIP.jpg" alt="Logo" className="sidebar-logo" />
            {sidebarOpen && (
              <div className="user-info">
                <img
                  src={`http://localhost:9999${user?.profilePicture}`}
                  alt="User Avatar"
                  className="user-avatar"
                />
                <span className="user-name">{user?.fullName || "Teacher"}</span>
              </div>
            )}
          </div>
          <Nav className="flex-column sidebar-nav">
            <Nav.Link
              onClick={() => handleNavigation("dashboard")}
              className={`sidebar-link ${
                activeView === "dashboard" ? "active" : ""
              }`}
            >
              <FaHome className="sidebar-icon" />
              {sidebarOpen && <span>Home</span>}
            </Nav.Link>
            <Nav.Link
              onClick={() => handleNavigation("mycourses")}
              className={`sidebar-link ${
                activeView === "mycourses" ? "active" : ""
              }`}
            >
              <FaBook className="sidebar-icon" />
              {sidebarOpen && <span>My Courses</span>}
            </Nav.Link>
            <Nav.Link
              onClick={() => handleNavigation("lectures")}
              className={`sidebar-link ${
                activeView === "lectures" ? "active" : ""
              }`}
            >
              <FaChalkboardTeacher className="sidebar-icon" />
              {sidebarOpen && <span>Lectures</span>}
            </Nav.Link>
            <Nav.Link
              onClick={() => handleNavigation("settings")}
              className={`sidebar-link ${
                activeView === "settings" ? "active" : ""
              }`}
            >
              <FaCog className="sidebar-icon" />
              {sidebarOpen && <span>Settings</span>}
            </Nav.Link>
            <Nav.Link onClick={handleLogout} className="sidebar-link">
              <FaSignOutAlt className="sidebar-icon" />
              {sidebarOpen && <span>Logout</span>}
            </Nav.Link>
          </Nav>
        </div>

        {/* Main Content */}
        <div className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
          <Navbar bg="light" className="dashboard-navbar">
            <FaBars className="hamburger-icon" onClick={toggleSidebar} />
            <Navbar.Brand className="ms-3">
              Teacher Dashboard{" "}
              {activeView !== "dashboard" &&
                `- ${activeView.charAt(0).toUpperCase() + activeView.slice(1)}`}
            </Navbar.Brand>
            <Nav className="ms-auto">
              <Nav.Link href="#notifications" className="me-2">
                <FaBell />
              </Nav.Link>
              <Nav.Link href="/teacher/settings" className="me-3">
                <FaUserCircle />
              </Nav.Link>
            </Nav>
          </Navbar>

          <Container fluid className="pt-4">
            {renderContent()}
          </Container>
        </div>
      </div>
    </TeacherProvider>
  );
};

export default TeacherDashboard;
