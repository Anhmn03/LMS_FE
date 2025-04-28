import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Badge,
  Spinner,
  Modal,
  Form,
} from "react-bootstrap";
import { FaBook, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useTeacher } from "../../context/TeacherContext";
import { useAdminData } from "../../context/AdminDataContext";
import { useAuth } from "../../context/AuthContext";

const MyCourses = () => {
  const { courses, loading, error, fetchTeacherCourses } = useTeacher();
  const { categoriesData, fetchCategories } = useAdminData();
  const { idLogin } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null, // Sẽ lưu file image
    price: "",
    shortIntroVideo: null, // Sẽ lưu file video
    categoryId: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleClose = () => {
    setShowModal(false);
    setFormData({
      title: "",
      description: "",
      image: null,
      price: "",
      shortIntroVideo: null,
      categoryId: "",
    });
    setErrors({});
    setApiError(null);
  };

  const handleShow = () => setShowModal(true);

  const validateForm = () => {
    const newErrors = {};
    const imageRegex = /\.(jpe?g|png|gif)$/i;
    const videoRegex = /\.(mp4|webm|ogg)$/i;

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = "Price must be a positive number";
    }
    if (formData.image && !imageRegex.test(formData.image.name)) {
      newErrors.image = "Image must be a valid format (jpg, jpeg, png, gif)";
    }
    if (
      formData.shortIntroVideo &&
      !videoRegex.test(formData.shortIntroVideo.name)
    ) {
      newErrors.shortIntroVideo =
        "Video must be a valid format (mp4, webm, ogg)";
    }
    if (!formData.categoryId) newErrors.categoryId = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createCourse = async (courseData) => {
    if (!idLogin) {
      setApiError("Teacher ID is missing");
      return false;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setApiError("No authentication token found");
      return false;
    }

    setIsSubmitting(true);
    setApiError(null);

    // Sử dụng FormData để gửi dữ liệu multipart/form-data
    const formDataToSend = new FormData();
    formDataToSend.append("title", courseData.title);
    formDataToSend.append("description", courseData.description);
    formDataToSend.append("price", courseData.price);
    formDataToSend.append("categoryId", courseData.categoryId);
    formDataToSend.append("teacherId", idLogin);
    if (courseData.image) {
      formDataToSend.append("image", courseData.image);
    }
    if (courseData.shortIntroVideo) {
      formDataToSend.append("shortIntroVideo", courseData.shortIntroVideo);
    }

    try {
      const res = await fetch("http://localhost:9999/api/coursesTeacher", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Không cần set "Content-Type" vì FormData tự động set thành multipart/form-data
        },
        body: formDataToSend,
      });
      const data = await res.json();

      console.log("Create course API response:", data);

      if (res.ok && data.success) {
        await fetchTeacherCourses();
        return true;
      } else {
        setApiError(data.message || "Failed to create course");
        return false;
      }
    } catch (err) {
      setApiError("Error creating course: " + err.message);
      console.error("Error creating course:", err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = await createCourse(formData);
    if (success) {
      handleClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  if (loading || isSubmitting) {
    return (
      <Container fluid className="pt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="pt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Button variant="primary" onClick={fetchTeacherCourses}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid className="pt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Courses</h2>
        <Button variant="primary" onClick={handleShow}>
          <FaBook className="me-2" /> Create New Course
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <h4>No Courses Found</h4>
            <p>You haven't created any courses yet.</p>
            <Button variant="primary" onClick={handleShow}>
              <FaBook className="me-2" /> Create Your First Course
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {courses.map((course) => (
            <Col md={6} lg={4} key={course._id} className="mb-4">
              <Card className="h-100 course-card">
                {course.image && (
                  <div className="course-image-container">
                    <Card.Img
                      variant="top"
                      src={`http://localhost:9999${course.image}`} // Thêm domain/port của BE
                      alt={course.title}
                      className="course-image"
                      onError={(e) =>
                        (e.target.src = "/path/to/fallback-image.jpg")
                      } // Thêm fallback image nếu lỗi
                    />
                  </div>
                )}
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <Badge
                      bg={
                        course.status === "APPROVED"
                          ? "success"
                          : course.status === "PENDING"
                          ? "warning"
                          : "danger"
                      }
                      className="mb-2"
                    >
                      {course.status || "N/A"}
                    </Badge>
                    <Badge bg="info" className="mb-2">
                      {course.categoryId?.name || "Uncategorized"}
                    </Badge>
                  </div>
                  <Card.Title>{course.title || "Untitled Course"}</Card.Title>
                  <Card.Text className="course-description">
                    {course.description || "No description available"}
                  </Card.Text>
                  <p className="mb-2">
                    <strong>Price:</strong> ${course.price || 0}
                  </p>
                  <p className="mb-2">
                    <strong>Completion Status:</strong>{" "}
                    {course.completionStatus || "Not Started"}
                  </p>
                </Card.Body>
                <Card.Footer className="bg-white">
                  <div className="d-flex justify-content-between">
                    <Button variant="outline-primary" size="sm">
                      <FaEye className="me-1" /> View
                    </Button>
                    <Button variant="outline-success" size="sm">
                      <FaEdit className="me-1" /> Edit
                    </Button>
                    <Button variant="outline-danger" size="sm">
                      <FaTrash className="me-1" /> Delete
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header
          closeButton
          className="bg-gradient-to-r from-blue-500 to-indigo-600"
        >
          <Modal.Title className="text-white">Create New Course</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-gray-50">
          {apiError && (
            <div className="alert alert-danger" role="alert">
              {apiError}
            </div>
          )}
          <Form className="space-y-4">
            <Form.Group>
              <Form.Label className="font-medium text-gray-700">
                Course Title
              </Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                isInvalid={!!errors.title}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter course title"
              />
              <Form.Control.Feedback
                type="invalid"
                className="text-red-500 text-sm mt-1"
              >
                {errors.title}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label className="font-medium text-gray-700">
                Description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                isInvalid={!!errors.description}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500"
                placeholder="Describe your course"
              />
              <Form.Control.Feedback
                type="invalid"
                className="text-red-500 text-sm mt-1"
              >
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label className="font-medium text-gray-700">
                Course Image (jpg, jpeg, png, gif)
              </Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept=".jpg,.jpeg,.png,.gif"
                onChange={handleInputChange}
                isInvalid={!!errors.image}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500"
              />
              <Form.Control.Feedback
                type="invalid"
                className="text-red-500 text-sm mt-1"
              >
                {errors.image}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label className="font-medium text-gray-700">
                Price ($)
              </Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                isInvalid={!!errors.price}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter price"
              />
              <Form.Control.Feedback
                type="invalid"
                className="text-red-500 text-sm mt-1"
              >
                {errors.price}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label className="font-medium text-gray-700">
                Short Intro Video (mp4, webm, ogg)
              </Form.Label>
              <Form.Control
                type="file"
                name="shortIntroVideo"
                accept=".mp4,.webm,.ogg"
                onChange={handleInputChange}
                isInvalid={!!errors.shortIntroVideo}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500"
              />
              <Form.Control.Feedback
                type="invalid"
                className="text-red-500 text-sm mt-1"
              >
                {errors.shortIntroVideo}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label className="font-medium text-gray-700">
                Category
              </Form.Label>
              <Form.Control
                as="select"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                isInvalid={!!errors.categoryId}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a category</option>
                {categoriesData.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback
                type="invalid"
                className="text-red-500 text-sm mt-1"
              >
                {errors.categoryId}
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
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          >
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Creating...
              </>
            ) : (
              "Create Course"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyCourses;
