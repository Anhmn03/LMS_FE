import React, { useState } from "react";
import { Table, Badge, Button, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const CourseDetailsModal = ({ show, onHide, course, onUpdateStatus }) => {
  const [status, setStatus] = useState(course?.status || "DRAFT");

  const handleStatusUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:9999/api/coursesManager/${course._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      onUpdateStatus();
      onHide();
    } catch (error) {
      console.error("Error updating course status:", error);
    }
  };

  if (!course) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Course Details</h4>
          <Button variant="link" onClick={onHide}>
            <i className="bi bi-x-lg"></i>
          </Button>
        </div>
        <div className="mb-4">
          <h5 className="mb-2">Title: {course.title}</h5>
          <p>
            <strong>Description:</strong> {course.description}
          </p>
          <p>
            <strong>Teacher:</strong> {course.teacher || "N/A"}
          </p>
          <p>
            <strong>Category:</strong> {course.category || "N/A"}
          </p>
          <p>
            <strong>Price:</strong> ${course.price}
          </p>
          <p>
            <strong>Current Status:</strong> {course.status}
          </p>
          <p>
            <strong>Short Intro:</strong> {course.shortIntro || "N/A"}
          </p>
        </div>
        <div className="mb-3">
          <Form.Label>Update Status</Form.Label>
          <Form.Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="DRAFT">DRAFT</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </Form.Select>
        </div>
        <Button variant="primary" onClick={handleStatusUpdate}>
          Update Status
        </Button>
      </Modal.Body>
    </Modal>
  );
};

const CoursesTable = ({ courses, onRefresh }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleShowDetails = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:9999/api/courses/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setSelectedCourse(data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  };

  const handleUpdateStatus = async () => {
    await onRefresh(); // Refresh the table after status update
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return <Badge bg="success">Đã duyệt</Badge>;
      case "PENDING":
        return <Badge bg="warning">Chờ duyệt</Badge>;
      case "DRAFT":
        return <Badge bg="secondary">Bản nháp</Badge>;
      case "REJECTED":
        return <Badge bg="danger">Bị từ chối</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  return (
    <div className="table-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Danh sách Khóa Học</h3>
        <Button variant="success">+ Thêm Khóa Học</Button>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên khóa học</th>
            <th>Giảng viên</th>
            <th>Danh mục</th>
            <th>Giá (USD)</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id}>
              <td>{course._id.substring(0, 8)}...</td>
              <td>{course.title}</td>
              <td>{course.teacherId?.fullName || "N/A"}</td>
              <td>{course.categoryId?.name || "N/A"}</td>
              <td>${course.price}</td>
              <td>{getStatusBadge(course.status)}</td>
              <td>
                <Button
                  variant="outline-info"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShowDetails(course._id)}
                >
                  <FaEye />
                </Button>
                <Button variant="outline-primary" size="sm" className="me-2">
                  <FaEdit />
                </Button>
                <Button variant="outline-danger" size="sm">
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <CourseDetailsModal
        show={showModal}
        onHide={() => setShowModal(false)}
        course={selectedCourse}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default CoursesTable;
