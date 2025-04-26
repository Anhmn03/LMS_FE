import React from "react";
import { Table, Badge, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const TeachersTable = ({ teachers }) => {
  return (
    <div className="table-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Danh sách Giảng Viên</h3>
        <Button variant="success">+ Thêm Giảng Viên</Button>
      </div>
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
          {teachers.map((teacher) => (
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
              <td>{new Date(teacher.createdAt).toLocaleDateString("vi-VN")}</td>
              <td>
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

export default TeachersTable;
