import React from "react";
import { Table, Badge, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const StudentsTable = ({ students }) => {
  return (
    <div className="table-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Danh sách Học Viên</h3>
        <Button variant="success">+ Thêm Học Viên</Button>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ Tên</th>
            <th>Email</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id || student.email}>
              <td>
                {student._id ? student._id.substring(0, 8) + "..." : "N/A"}
              </td>
              <td>{student.fullName}</td>
              <td>{student.email}</td>
              <td>
                {student.createdAt &&
                  new Date(student.createdAt).toLocaleDateString("vi-VN")}
              </td>
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

export default StudentsTable;
