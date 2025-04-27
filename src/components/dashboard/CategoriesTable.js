import React, { useState } from "react";
import { Table, Button, Form, Modal, Alert, Row, Col } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

const CategoriesTable = ({ categories, onRefresh }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Filter categories based on search keyword
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const handleAddCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:9999/api/category/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: new URLSearchParams({ name: newCategoryName }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create category");
      }

      setShowAddModal(false);
      setNewCategoryName("");
      setErrorMessage(null);
      await onRefresh();
    } catch (err) {
      console.error("Error creating category:", err);
      setErrorMessage(err.message || "Có lỗi xảy ra khi tạo danh mục");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:9999/api/category/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete category");
      }

      await onRefresh();
    } catch (err) {
      console.error("Error deleting category:", err);
      setErrorMessage(err.message || "Có lỗi xảy ra khi xóa danh mục");
    }
  };

  return (
    <div className="table-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Danh sách Danh Mục</h3>
        <Button variant="success" onClick={() => setShowAddModal(true)}>
          + Thêm Danh Mục
        </Button>
      </div>

      {/* Search Section */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group className="align-items-center">
            <Form.Label>Tìm kiếm theo tên:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên danh mục..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Danh Mục</th>
            <th>Ngày Tạo</th>
            <th>Ngày Cập Nhật</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category) => (
            <tr key={category._id}>
              <td>{category._id.substring(0, 8)}...</td>
              <td>{category.name}</td>
              <td>
                {category.createdAt &&
                  new Date(category.createdAt).toLocaleDateString("vi-VN")}
              </td>
              <td>
                {category.updatedAt &&
                  new Date(category.updatedAt).toLocaleDateString("vi-VN")}
              </td>
              <td>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeleteCategory(category._id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Category Modal */}
      <Modal
        show={showAddModal}
        onHide={() => {
          setShowAddModal(false);
          setErrorMessage(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm Danh Mục Mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên Danh Mục</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên danh mục..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAddModal(false);
              setErrorMessage(null);
            }}
          >
            Hủy
          </Button>
          <Button variant="primary" onClick={handleAddCategory}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CategoriesTable;
