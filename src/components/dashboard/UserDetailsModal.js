import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Row,
  Col,
  Badge,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  FaUserCircle,
  FaGraduationCap,
  FaBook,
  FaCalendarAlt,
} from "react-icons/fa";

const UserDetailsModal = ({ show, onHide, userId, userType }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (show && userId) {
      fetchUserDetails();
    }
  }, [show, userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:9999/api/users/detail/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user details: ${response.status}`);
      }

      const data = await response.json();
      setUserData(data.user);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Không thể tải thông tin người dùng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    setUpdateLoading(true);
    setUpdateSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const newStatus =
        userData.status === "ACTIVE" || !userData.isBanned
          ? "INACTIVE"
          : "ACTIVE";

      const response = await fetch(
        `http://localhost:9999/api/users/updateStatus/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }

      const result = await response.json();

      // Update the local user data with the new status
      setUserData({
        ...userData,
        status: result.user.status,
        isBanned: result.user.isBanned,
      });

      setUpdateSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error updating user status:", err);
      setError(
        "Không thể cập nhật trạng thái người dùng. Vui lòng thử lại sau."
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {userType === "teacher"
            ? "Thông tin Giảng Viên"
            : "Thông tin Học Viên"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Đang tải thông tin...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : userData ? (
          <>
            {updateSuccess && (
              <Alert variant="success">Cập nhật trạng thái thành công!</Alert>
            )}

            <Row>
              <Col md={4} className="text-center mb-4">
                <FaUserCircle size={100} className="text-secondary mb-3" />
                <h4>{userData.fullName}</h4>
                <p className="text-muted">{userData.email}</p>
                <div className="mb-3">
                  <Badge
                    bg={
                      userData.status === "ACTIVE" && !userData.isBanned
                        ? "success"
                        : "danger"
                    }
                  >
                    {userData.status === "ACTIVE" && !userData.isBanned
                      ? "Hoạt động"
                      : "Không hoạt động"}
                  </Badge>
                </div>
                <Button
                  variant={
                    userData.status === "ACTIVE" && !userData.isBanned
                      ? "danger"
                      : "success"
                  }
                  onClick={handleUpdateStatus}
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Đang cập nhật...
                    </>
                  ) : userData.status === "ACTIVE" && !userData.isBanned ? (
                    "Vô hiệu hóa tài khoản"
                  ) : (
                    "Kích hoạt tài khoản"
                  )}
                </Button>
              </Col>

              <Col md={8}>
                <Card className="mb-3">
                  <Card.Header>
                    <h5 className="mb-0">Thông tin cơ bản</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col sm={4} className="text-muted">
                        ID:
                      </Col>
                      <Col sm={8}>{userData._id}</Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col sm={4} className="text-muted">
                        Vai trò:
                      </Col>
                      <Col sm={8}>{userData.role?.name || "N/A"}</Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col sm={4} className="text-muted">
                        Ngày tạo:
                      </Col>
                      <Col sm={8}>
                        <FaCalendarAlt className="me-2" />
                        {formatDate(userData.createdAt)}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {userType === "student" && userData.enrolledCourses && (
                  <Card>
                    <Card.Header>
                      <h5 className="mb-0">
                        <FaGraduationCap className="me-2" />
                        Khóa học đã đăng ký (
                        {userData.enrolledCourses.length || 0})
                      </h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                      {userData.enrolledCourses.length > 0 ? (
                        <ul className="list-group list-group-flush">
                          {userData.enrolledCourses.map((course, index) => (
                            <li key={index} className="list-group-item">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h6>{course.courseTitle}</h6>
                                  <small className="text-muted">
                                    Đăng ký: {formatDate(course.enrolledAt)}
                                  </small>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="p-3 mb-0">
                          Chưa có khóa học nào được đăng ký.
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                )}

                {userType === "teacher" && userData.courses && (
                  <Card>
                    <Card.Header>
                      <h5 className="mb-0">
                        <FaBook className="me-2" />
                        Khóa học giảng dạy ({userData.courses?.length || 0})
                      </h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                      {userData.courses?.length > 0 ? (
                        <ul className="list-group list-group-flush">
                          {userData.courses.map((course, index) => (
                            <li key={index} className="list-group-item">
                              <h6>{course.courseTitle}</h6>
                              <div className="d-flex justify-content-between">
                                <small className="text-muted">
                                  {course.lessons?.length || 0} bài học
                                </small>
                                <small className="text-muted">
                                  Giá: {course.price?.toLocaleString("vi-VN")}đ
                                </small>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="p-3 mb-0">
                          Chưa có khóa học nào được tạo.
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                )}
              </Col>
            </Row>
          </>
        ) : (
          <div className="text-center py-5">
            <p>Không có dữ liệu người dùng.</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailsModal;
