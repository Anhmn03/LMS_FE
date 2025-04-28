import React, { useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaUserTag,
  FaCalendarAlt,
  FaEdit,
} from "react-icons/fa";

const Settings = () => {
  const { user, idLogin } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    specialization: user?.specialization || "",
    expertise: user?.expertise || "",
    profilePicture: null,
  });
  const [updatedUser, setUpdatedUser] = useState(user);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleClose = () => {
    setShowModal(false);
    setFormData({
      fullName: updatedUser?.fullName || "",
      specialization: updatedUser?.specialization || "",
      expertise: updatedUser?.expertise || "",
      profilePicture: null,
    });
    setError(null);
    setFormErrors({});
  };

  const handleShow = () => setShowModal(true);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    const imageRegex = /\.(jpe?g|png)$/i;

    const trimmedFullName = formData.fullName.trim();
    if (!trimmedFullName) {
      errors.fullName = "Tên đầy đủ là bắt buộc";
    } else if (trimmedFullName.length < 2 || trimmedFullName.length > 50) {
      errors.fullName = "Tên đầy đủ phải từ 2 đến 50 ký tự";
    }

    const trimmedSpecialization = formData.specialization.trim();
    if (!trimmedSpecialization) {
      errors.specialization = "Chuyên ngành là bắt buộc";
    } else if (trimmedSpecialization.length > 100) {
      errors.specialization = "Chuyên ngành không được vượt quá 100 ký tự";
    }

    const trimmedExpertise = formData.expertise.trim();
    if (!trimmedExpertise) {
      errors.expertise = "Kinh nghiệm là bắt buộc";
    } else if (trimmedExpertise.length > 100) {
      errors.expertise = "Kinh nghiệm không được vượt quá 100 ký tự";
    }

    if (
      formData.profilePicture &&
      !imageRegex.test(formData.profilePicture.name)
    ) {
      errors.profilePicture = "Ảnh phải có định dạng jpg hoặc png";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const hasChanges = () => {
    const trimmedFullName = formData.fullName.trim();
    const trimmedSpecialization = formData.specialization.trim();
    const trimmedExpertise = formData.expertise.trim();

    return (
      trimmedFullName !== (updatedUser?.fullName || "") ||
      trimmedSpecialization !== (updatedUser?.specialization || "") ||
      trimmedExpertise !== (updatedUser?.expertise || "") ||
      formData.profilePicture !== null
    );
  };

  const updateTeacher = async () => {
    if (!idLogin) {
      setError("Không tìm thấy ID giáo viên");
      return false;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Không tìm thấy token xác thực");
      return false;
    }

    // Chỉ gửi các trường đã thay đổi
    const formDataToSend = new FormData();
    const trimmedFullName = formData.fullName.trim();
    const trimmedSpecialization = formData.specialization.trim();
    const trimmedExpertise = formData.expertise.trim();

    if (trimmedFullName !== (updatedUser?.fullName || "")) {
      formDataToSend.append("fullName", trimmedFullName);
    }
    if (trimmedSpecialization !== (updatedUser?.specialization || "")) {
      formDataToSend.append("specialization", trimmedSpecialization);
    }
    if (trimmedExpertise !== (updatedUser?.expertise || "")) {
      formDataToSend.append("expertise", trimmedExpertise);
    }
    if (formData.profilePicture) {
      formDataToSend.append("profilePicture", formData.profilePicture);
    }

    // Kiểm tra xem có dữ liệu nào để gửi không
    if (!hasChanges()) {
      setError("Không có thay đổi nào để cập nhật");
      return false;
    }

    try {
      const res = await fetch(
        `http://localhost:9999/api/users/updateTeacher/${idLogin}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Phản hồi từ server không phải JSON");
      }

      const data = await res.json();

      if (res.ok && data.message === "Teacher updated successfully") {
        setUpdatedUser({
          ...data.user,
          role: { name: data.user.role }, // Backend trả về role dưới dạng chuỗi
        });
        setSuccessMessage("Cập nhật thông tin giáo viên thành công!");
        return true;
      } else {
        setError(data.message || "Không thể cập nhật thông tin giáo viên");
        return false;
      }
    } catch (err) {
      setError("Lỗi khi cập nhật thông tin: " + err.message);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      return;
    }

    const success = await updateTeacher();
    if (success) {
      setTimeout(() => {
        handleClose();
      }, 1500);
    }
  };

  return (
    <Container fluid className="pt-4">
      <h2>Profile Settings</h2>
      <Card className="mt-4 settings-card">
        <Card.Header as="h4">
          <div className="d-flex justify-content-between align-items-center">
            <span>Teacher Information</span>
            <Button variant="outline-primary" size="sm" onClick={handleShow}>
              <FaEdit className="me-1" /> Edit
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {successMessage && (
            <Alert
              variant="success"
              onClose={() => setSuccessMessage(null)}
              dismissible
            >
              {successMessage}
            </Alert>
          )}
          <Row>
            <Col md={6}>
              <div className="user-info-item">
                <FaIdCard className="settings-icon" />
                <div>
                  <p className="info-label">User ID:</p>
                  <p className="info-value">{updatedUser?._id || "N/A"}</p>
                </div>
              </div>
              <div className="user-info-item">
                <FaEnvelope className="settings-icon" />
                <div>
                  <p className="info-label">Email:</p>
                  <p className="info-value">{updatedUser?.email || "N/A"}</p>
                </div>
              </div>
              <div className="user-info-item">
                <FaUser className="settings-icon" />
                <div>
                  <p className="info-label">Full Name:</p>
                  <p className="info-value">{updatedUser?.fullName || "N/A"}</p>
                </div>
              </div>
              <div className="user-info-item">
                <FaUser className="settings-icon" />
                <div>
                  <p className="info-label">Chuyên Ngành:</p>
                  <p className="info-value">
                    {updatedUser?.specialization || "N/A"}
                  </p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="user-info-item">
                <FaUserTag className="settings-icon" />
                <div>
                  <p className="info-label">Role:</p>
                  <p className="info-value">
                    {updatedUser?.role?.name || "N/A"}
                  </p>
                </div>
              </div>
              <div className="user-info-item">
                <div className="status-indicator">
                  <span
                    className={`status-dot ${
                      updatedUser?.status === "ACTIVE" ? "active" : "inactive"
                    }`}
                  ></span>
                </div>
                <div>
                  <p className="info-label">Status:</p>
                  <p className="info-value">{updatedUser?.status || "N/A"}</p>
                </div>
              </div>
              <div className="user-info-item">
                <FaCalendarAlt className="settings-icon" />
                <div>
                  <p className="info-label">Created At:</p>
                  <p className="info-value">
                    {formatDate(updatedUser?.createdAt)}
                  </p>
                </div>
              </div>
              <div className="user-info-item">
                <FaUser className="settings-icon" />
                <div>
                  <p className="info-label">Kinh Nghiệm:</p>
                  <p className="info-value">
                    {updatedUser?.expertise || "N/A"}
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header
          closeButton
          className="bg-gradient-to-r from-blue-500 to-indigo-600"
        >
          <Modal.Title className="text-white">
            Edit Teacher Information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-gray-50">
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          <Form className="space-y-4">
            <Form.Group>
              <Form.Label className="font-medium text-gray-700">
                Tên Đầy Đủ
              </Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                isInvalid={!!formErrors.fullName}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500"
                placeholder="Nhập tên đầy đủ"
              />
              <Form.Control.Feedback
                type="invalid"
                className="text-red-500 text-sm mt-1"
              >
                {formErrors.fullName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label className="font-medium text-gray-700">
                Chuyên Ngành
              </Form.Label>
              <Form.Control
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                isInvalid={!!formErrors.specialization}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500"
                placeholder="Nhập chuyên ngành"
              />
              <Form.Control.Feedback
                type="invalid"
                className="text-red-500 text-sm mt-1"
              >
                {formErrors.specialization}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label className="font-medium text-gray-700">
                Kinh Nghiệm
              </Form.Label>
              <Form.Control
                type="text"
                name="expertise"
                value={formData.expertise}
                onChange={handleInputChange}
                isInvalid={!!formErrors.expertise}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500"
                placeholder="Nhập kinh nghiệm"
              />
              <Form.Control.Feedback
                type="invalid"
                className="text-red-500 text-sm mt-1"
              >
                {formErrors.expertise}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label className="font-medium text-gray-700">
                Ảnh Đại Diện (jpg, png)
              </Form.Label>
              <Form.Control
                type="file"
                name="profilePicture"
                accept=".jpg,.jpeg,.png"
                onChange={handleInputChange}
                isInvalid={!!formErrors.profilePicture}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500"
              />
              <Form.Control.Feedback
                type="invalid"
                className="text-red-500 text-sm mt-1"
              >
                {formErrors.profilePicture}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-gray-100">
          <Button
            variant="secondary"
            onClick={handleClose}
            className="rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium"
          >
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          >
            Cập Nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Settings;
