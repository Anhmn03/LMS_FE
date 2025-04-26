import React from "react";
import { Table, Badge, Button } from "react-bootstrap";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const CoursesTable = ({ courses }) => {
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
              <td>
                {course.status === "APPROVED" ? (
                  <Badge bg="success">Đã duyệt</Badge>
                ) : (
                  <Badge bg="warning">Chờ duyệt</Badge>
                )}
              </td>
              <td>
                <Button variant="outline-info" size="sm" className="me-2">
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
    </div>
  );
};

export default CoursesTable;
