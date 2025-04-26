import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Navbar, Nav } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { useAdminData } from "../../context/AdminDataContext";
import {
  FaBars,
  FaHome,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBook,
  FaDollarSign,
  FaComments,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import TeachersTable from "../../components/dashboard/TeacherTable";
import StudentsTable from "../../components/dashboard/StudentTable";
import CoursesTable from "../../components/dashboard/CourseTable";
import "./Dashboard.css";

const AdminDashboard = () => {
  const { user } = useAuth();
  const {
    stats,
    loading,
    error,
    teachersData,
    studentsData,
    coursesData,
    fetchTeachers,
    fetchStudents,
    fetchCourses,
  } = useAdminData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("home");
  const [viewLoading, setViewLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract the view from pathname
    const path = location.pathname.split("/").pop();
    if (path === "admin-dashboard" || path === "admin") {
      setActiveView("home");
    } else if (["teachers", "students", "courses", "revenue"].includes(path)) {
      setActiveView(path);
    }
  }, [location]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigation = async (view) => {
    setActiveView(view);

    if (view !== "home" && view !== "revenue") {
      setViewLoading(true);

      try {
        if (view === "teachers") {
          await fetchTeachers();
        } else if (view === "students") {
          await fetchStudents();
        } else if (view === "courses") {
          await fetchCourses();
        }
      } catch (error) {
        console.error(`Error loading ${view} data:`, error);
      } finally {
        setViewLoading(false);
      }
    }

    navigate(view === "home" ? "/admin" : `/${view}`);
  };

  const renderContent = () => {
    if (loading || viewLoading) {
      return <div className="text-center py-5">Loading...</div>;
    }

    if (error) {
      return <div className="text-center py-5 text-danger">{error}</div>;
    }

    switch (activeView) {
      case "teachers":
        return <TeachersTable teachers={teachersData} />;
      case "students":
        return <StudentsTable students={studentsData} />;
      case "courses":
        return <CoursesTable courses={coursesData} />;
      case "revenue":
        return (
          <div className="text-center py-5">
            <h3>Báo cáo doanh thu</h3>
            <p>Chức năng đang phát triển...</p>
          </div>
        );
      default:
        return (
          <>
            <h2>Welcome Back, {user?.fullName || "Admin"}</h2>
            <Row className="mt-4">
              <Col md={4}>
                <Card className="stats-card">
                  <Card.Body>
                    <h5>Tổng Số Giảng Viên</h5>
                    <h3>{stats.teachers}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="stats-card">
                  <Card.Body>
                    <h5>Tổng Số Học Viên</h5>
                    <h3>{stats.students}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="stats-card">
                  <Card.Body>
                    <h5>Tổng Số Khóa Học</h5>
                    <h3>{stats.courses}</h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col>
                <Card className="chart-card">
                  <Card.Body>
                    <p className="text-center py-5">
                      Course enrollment data is currently unavailable.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
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
              <span className="user-name">{user?.fullName || "Admin"}</span>
            </div>
          )}
        </div>
        <Nav className="flex-column sidebar-nav">
          <Nav.Link
            onClick={() => handleNavigation("home")}
            className={`sidebar-link ${activeView === "home" ? "active" : ""}`}
          >
            <FaHome className="sidebar-icon" />
            {sidebarOpen && <span>Home</span>}
          </Nav.Link>
          <Nav.Link
            onClick={() => handleNavigation("teachers")}
            className={`sidebar-link ${
              activeView === "teachers" ? "active" : ""
            }`}
          >
            <FaChalkboardTeacher className="sidebar-icon" />
            {sidebarOpen && <span>Giảng Viên</span>}
          </Nav.Link>
          <Nav.Link
            onClick={() => handleNavigation("students")}
            className={`sidebar-link ${
              activeView === "students" ? "active" : ""
            }`}
          >
            <FaUserGraduate className="sidebar-icon" />
            {sidebarOpen && <span>Học Viên</span>}
          </Nav.Link>
          <Nav.Link
            onClick={() => handleNavigation("courses")}
            className={`sidebar-link ${
              activeView === "courses" ? "active" : ""
            }`}
          >
            <FaBook className="sidebar-icon" />
            {sidebarOpen && <span>Khóa học</span>}
          </Nav.Link>
          <Nav.Link
            onClick={() => handleNavigation("revenue")}
            className={`sidebar-link ${
              activeView === "revenue" ? "active" : ""
            }`}
          >
            <FaDollarSign className="sidebar-icon" />
            {sidebarOpen && <span>Doanh Thu</span>}
          </Nav.Link>
        </Nav>
      </div>

      {/* Main Content */}
      <div className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
        {/* Navbar */}
        <Navbar bg="light" className="dashboard-navbar">
          <FaBars className="hamburger-icon" onClick={toggleSidebar} />
          <Navbar.Brand className="ms-3">
            Admin Dashboard{" "}
            {activeView !== "home" &&
              `- ${activeView.charAt(0).toUpperCase() + activeView.slice(1)}`}
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link href="#notifications">
              <FaComments />
            </Nav.Link>
          </Nav>
        </Navbar>

        {/* Dynamic Content */}
        <Container fluid className="pt-4">
          {renderContent()}
        </Container>
      </div>
    </div>
  );
};

export default AdminDashboard;
