import React, { useState } from "react";
import { Table, Badge, Button } from "react-bootstrap";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import UserDetailsModal from "./UserDetailsModal";
import {Form, Row, Col } from "react-bootstrap";
const TeachersTable = ({ teachers, onRefresh }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

  const handleViewDetails = (teacherId) => {
    setSelectedTeacherId(teacherId);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    // Optionally refresh the data when closing the modal
    if (onRefresh) onRefresh();
  };

  // Filter and search logic
  const [searchType, setSearchType] = useState("name");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter and search logic
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" &&
        !(teacher.status === "INACTIVE" || teacher.isBanned)) ||
      (statusFilter === "inactive" &&
        (teacher.status === "INACTIVE" || teacher.isBanned));

    const matchesSearch =
      searchKeyword === "" ||
      (searchType === "name" &&
        teacher.fullName.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      (searchType === "email" &&
        teacher.email.toLowerCase().includes(searchKeyword.toLowerCase()));

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
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ Tên</th>
              <th>Email</th>
              <th>Số Khóa học</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((teacher) => (
              <tr key={teacher._id}>
                <td>{teacher._id.substring(0, 8)}...</td>
                <td>{teacher.fullName}</td>
                <td>{teacher.email}</td>
                <td>{teacher.totalCourses || 0}</td>
                <td>
                  {teacher.status === "INACTIVE" || teacher.isBanned ? (
                    <Badge bg="danger">Không hoạt động</Badge>
                  ) : (
                    <Badge bg="success">Hoạt động</Badge>
                  )}
                </td>
                <td>
                  {new Date(teacher.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td>
                  <Button
                    variant="outline-info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleViewDetails(teacher._id)}
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
          userId={selectedTeacherId}
          userType="teacher"
        />
      </div>
    </div>
  );
};

export default TeachersTable;
