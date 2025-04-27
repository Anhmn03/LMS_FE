import React, { useState } from "react";
import { Table, Badge, Button } from "react-bootstrap";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import UserDetailsModal from "./UserDetailsModal";
import {Form, Row, Col } from "react-bootstrap";

const StudentsTable = ({ students, onRefresh }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const handleViewDetails = (studentId) => {
    setSelectedStudentId(studentId);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    // Optionally refresh the data when closing the modal
    if (onRefresh) onRefresh();
  };

  const [searchType, setSearchType] = useState("name");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter and search logic
  const filteredStudents = students.filter((student) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" &&
        !(student.status === "INACTIVE" || student.isBanned)) ||
      (statusFilter === "inactive" &&
        (student.status === "INACTIVE" || student.isBanned));

    const matchesSearch =
      searchKeyword === "" ||
      (searchType === "name" &&
        student.fullName.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      (searchType === "email" &&
        student.email.toLowerCase().includes(searchKeyword.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="table-container">
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group as={Row} className="align-items-center">
            <Col xs="auto">
              <Form.Label>Tìm kiếm theo:</Form.Label>
            </Col>
            <Col xs="auto">
              <Form.Select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="name">Họ Tên</option>
                <option value="email">Email</option>
              </Form.Select>
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder={`Nhập ${
                  searchType === "name" ? "họ tên" : "email"
                }...`}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </Col>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group as={Row} className="align-items-center">
            <Col xs="auto">
              <Form.Label>Lọc trạng thái:</Form.Label>
            </Col>
            <Col>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </Form.Select>
            </Col>
          </Form.Group>
        </Col>
      </Row>
      <div className="table-container">
        {/* <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Danh sách Học Viên</h3>
          <Button variant="success">+ Thêm Học Viên</Button>
        </div> */}
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ Tên</th>
              <th>Email</th>
              {/* <th>Số Khóa học</th> */}
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id || student.email}>
                <td>
                  {student._id ? student._id.substring(0, 8) + "..." : "N/A"}
                </td>
                <td>{student.fullName}</td>
                <td>{student.email}</td>
                {/* <td>{student.totalCourses || 0}</td> */}
                <td>
                  {student.status === "INACTIVE" || student.isBanned ? (
                    <Badge bg="danger">Không hoạt động</Badge>
                  ) : (
                    <Badge bg="success">Hoạt động</Badge>
                  )}
                </td>
                <td>
                  {student.createdAt &&
                    new Date(student.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td>
                  <Button
                    variant="outline-info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleViewDetails(student._id)}
                    disabled={!student._id}
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

        {/* User Details Modal */}
        <UserDetailsModal
          show={showDetailsModal}
          onHide={handleCloseModal}
          userId={selectedStudentId}
          userType="student"
        />
      </div>
    </div>
  );
};

export default StudentsTable;
