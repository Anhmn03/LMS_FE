import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const AddTeacherForm = ({ onTeacherAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:9999/api/users/createTeacher",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create teacher");
      }

      setSuccess(true);
      setFormData({ email: "", fullName: "" });

      // Notify parent component about the new teacher
      if (onTeacherAdded) {
        onTeacherAdded(data.user);
      }

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message || "An error occurred while creating the teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-teacher-form p-4 border rounded bg-white">
      <h3 className="mb-4">Thêm Giảng Viên Mới</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
        <Alert variant="success">
          Giảng viên đã được tạo thành công và thông tin đăng nhập đã được gửi
          qua email.
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Họ Tên</Form.Label>
          <Form.Control
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="Nhập họ tên giảng viên"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Nhập địa chỉ email"
          />
          <Form.Text className="text-muted">
            Email này sẽ được sử dụng để gửi thông tin đăng nhập.
          </Form.Text>
        </Form.Group>

        <div className="d-flex justify-content-end mt-4">
          <Button
            variant="secondary"
            className="me-2"
            onClick={onCancel}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Đang xử lý..." : "Tạo Giảng Viên"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddTeacherForm;
