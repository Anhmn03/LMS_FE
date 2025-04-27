import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaUserTag,
  FaCalendarAlt,
} from "react-icons/fa";

const Settings = () => {
  const { user } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Container fluid className="pt-4">
      <h2>Profile Settings</h2>
      <Card className="mt-4 settings-card">
        <Card.Header as="h4">Teacher Information</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <div className="user-info-item">
                <FaIdCard className="settings-icon" />
                <div>
                  <p className="info-label">User ID:</p>
                  <p className="info-value">{user?._id || "N/A"}</p>
                </div>
              </div>
              <div className="user-info-item">
                <FaEnvelope className="settings-icon" />
                <div>
                  <p className="info-label">Email:</p>
                  <p className="info-value">{user?.email || "N/A"}</p>
                </div>
              </div>
              <div className="user-info-item">
                <FaUser className="settings-icon" />
                <div>
                  <p className="info-label">Full Name:</p>
                  <p className="info-value">{user?.fullName || "N/A"}</p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="user-info-item">
                <FaUserTag className="settings-icon" />
                <div>
                  <p className="info-label">Role:</p>
                  <p className="info-value">{user?.role?.name || "N/A"}</p>
                </div>
              </div>
              <div className="user-info-item">
                <div className="status-indicator">
                  <span
                    className={`status-dot ${
                      user?.status === "ACTIVE" ? "active" : "inactive"
                    }`}
                  ></span>
                </div>
                <div>
                  <p className="info-label">Status:</p>
                  <p className="info-value">{user?.status || "N/A"}</p>
                </div>
              </div>
              <div className="user-info-item">
                <FaCalendarAlt className="settings-icon" />
                <div>
                  <p className="info-label">Created At:</p>
                  <p className="info-value">{formatDate(user?.createdAt)}</p>
                </div>
              </div>
              <div className="user-info-item">
                <FaCalendarAlt className="settings-icon" />
                <div>
                  <p className="info-label">Updated At:</p>
                  <p className="info-value">{formatDate(user?.updatedAt)}</p>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Settings;
