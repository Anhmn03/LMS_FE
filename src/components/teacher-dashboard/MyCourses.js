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
import {
  FaBook,
  FaEdit,
  FaTrash,
  FaEye,
  FaPlay,
  FaArrowLeft,
  FaBan,
  FaUndo,
} from "react-icons/fa";
import { useTeacher } from "../../context/TeacherContext";
import { useAdminData } from "../../context/AdminDataContext";
import { useAuth } from "../../context/AuthContext";

const MyCourses = () => {
  const { courses, loading, error, fetchTeacherCourses } = useTeacher();
  const { categoriesData, fetchCategories } = useAdminData();
  const { idLogin } = useAuth();

  // State for showing banned courses
  const [showBannedCourses, setShowBannedCourses] = useState(false);

  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [courseToBan, setCourseToBan] = useState(null);
  const [isUnbanAction, setIsUnbanAction] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false); // Loading state for ban/unban

  // Create course modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    price: "",
    shortIntroVideo: null,
    categoryId: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Course detail view modal state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // Video player modal state
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Edit course modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    image: null,
    price: "",
    shortIntroVideo: null,
    categoryId: "",
  });
  const [editCourseId, setEditCourseId] = useState(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editApiError, setEditApiError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handler to show confirmation modal
  const handleShowConfirmModal = (course, actionIsUnban = false) => {
    setCourseToBan(course);
    setIsUnbanAction(actionIsUnban);
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setCourseToBan(null);
    setIsUnbanAction(false);
    setIsUpdatingStatus(false);
    setApiError(null);
  };

  // Handler to update completionStatus
  const handleUpdateStatus = async (newStatus) => {
    if (!idLogin) {
      setApiError("Teacher ID is missing");
      return false;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setApiError("No authentication token found");
      return false;
    }

    setIsUpdatingStatus(true);
    setApiError(null);

    try {
      const res = await fetch(
        `http://localhost:9999/api/coursesManager/${courseToBan._id}/completion-status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completionStatus: newStatus,
          }),
        }
      );
      const data = await res.json();

      if (res.ok && data.success) {
        // Fetch updated courses
        await fetchTeacherCourses();

        // Check if the current list will be empty after this action
        const updatedCourses = courses.map((course) =>
          course._id === courseToBan._id
            ? { ...course, completionStatus: newStatus }
            : course
        );
        const remainingCourses = updatedCourses.filter((course) =>
          showBannedCourses
            ? course.completionStatus === "BANNED"
            : course.completionStatus !== "BANNED"
        );

        // If the current list is empty after the action, switch to the other list
        if (remainingCourses.length === 0) {
          setShowBannedCourses(!showBannedCourses);
        }

        handleCloseConfirmModal();
        return true;
      } else {
        setApiError(
          data.message ||
            `Failed to ${newStatus === "BANNED" ? "ban" : "unban"} course`
        );
        return false;
      }
    } catch (err) {
      setApiError(
        `Error ${newStatus === "BANNED" ? "banning" : "unbanning"} course: ` +
          err.message
      );
      console.error(
        `Error ${newStatus === "BANNED" ? "banning" : "unbanning"} course:`,
        err
      );
      return false;
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Create course form handlers
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

  // Edit course form handlers
  const handleEditCourse = (course) => {
    setEditCourseId(course._id);
    setEditFormData({
      title: course.title || "",
      description: course.description || "",
      image: null, // We don't populate file inputs
      price: course.price || "",
      shortIntroVideo: null, // We don't populate file inputs
      categoryId: course.categoryId?._id || course.categoryId || "",
    });
    setShowEditModal(true);
    setErrors({});
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditFormData({
      title: "",
      description: "",
      image: null,
      price: "",
      shortIntroVideo: null,
      categoryId: "",
    });
    setEditCourseId(null);
    setEditApiError(null);
    setErrors({});
  };

  const handleEditInputChange = (e) => {
    const { name, value, files } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const validateEditForm = () => {
    const newErrors = {};
    const imageRegex = /\.(jpe?g|png|gif)$/i;
    const videoRegex = /\.(mp4|webm|ogg)$/i;

    if (!editFormData.title) newErrors.title = "Title is required";
    if (!editFormData.description)
      newErrors.description = "Description is required";
    if (
      !editFormData.price ||
      isNaN(editFormData.price) ||
      editFormData.price <= 0
    ) {
      newErrors.price = "Price must be a positive number";
    }
    if (editFormData.image && !imageRegex.test(editFormData.image.name)) {
      newErrors.image = "Image must be a valid format (jpg, jpeg, png, gif)";
    }
    if (
      editFormData.shortIntroVideo &&
      !videoRegex.test(editFormData.shortIntroVideo.name)
    ) {
      newErrors.shortIntroVideo =
        "Video must be a valid format (mp4, webm, ogg)";
    }
    if (!editFormData.categoryId) newErrors.categoryId = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateCourse = async () => {
    if (!idLogin) {
      setEditApiError("Teacher ID is missing");
      return false;
    }

    if (!editCourseId) {
      setEditApiError("Course ID is missing");
      return false;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setEditApiError("No authentication token found");
      return false;
    }

    setIsEditSubmitting(true);
    setEditApiError(null);

    const formDataToSend = new FormData();
    formDataToSend.append("title", editFormData.title);
    formDataToSend.append("description", editFormData.description);
    formDataToSend.append("price", editFormData.price);
    formDataToSend.append("categoryId", editFormData.categoryId);

    // Only append files if they were changed
    if (editFormData.image) {
      formDataToSend.append("image", editFormData.image);
    }
    if (editFormData.shortIntroVideo) {
      formDataToSend.append("shortIntroVideo", editFormData.shortIntroVideo);
    }

    try {
      const res = await fetch(
        `http://localhost:9999/api/coursesTeacher/${editCourseId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );
      const data = await res.json();

      console.log("Update course API response:", data);

      if (res.ok && data.success) {
        await fetchTeacherCourses();
        return true;
      } else {
        setEditApiError(data.message || "Failed to update course");
        return false;
      }
    } catch (err) {
      setEditApiError("Error updating course: " + err.message);
      console.error("Error updating course:", err);
      return false;
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateEditForm()) return;

    const success = await updateCourse();
    if (success) {
      handleCloseEditModal();
    }
  };

  // Course detail view handlers
  const handleViewCourse = async (courseId) => {
    setLoadingDetail(true);
    setDetailError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `http://localhost:9999/api/coursesTeacher/${courseId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSelectedCourse(data.data);
        setShowDetailModal(true);
      } else {
        setDetailError(data.message || "Failed to fetch course details");
      }
    } catch (err) {
      setDetailError("Error fetching course details: " + err.message);
      console.error("Error fetching course details:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedCourse(null);
    setDetailError(null);
  };

  const handlePlayVideo = () => {
    setShowVideoModal(true);
  };

  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
  };

  // Filter courses based on showBannedCourses state
  const filteredCourses = showBannedCourses
    ? courses.filter((course) => course.completionStatus === "BANNED")
    : courses.filter((course) => course.completionStatus !== "BANNED");

  if (loading || isSubmitting || loadingDetail || isEditSubmitting) {
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
        <h2>{showBannedCourses ? "Banned Courses" : "My Courses"}</h2>
        <div>
          <Button
            variant={showBannedCourses ? "outline-danger" : "outline-secondary"}
            onClick={() => setShowBannedCourses(!showBannedCourses)}
            className="me-2"
          >
            <FaBan className="me-1" />
            {showBannedCourses ? "Show Active Courses" : "Show Banned Courses"}
          </Button>
          {!showBannedCourses && (
            <Button variant="primary" onClick={handleShow}>
              <FaBook className="me-2" /> Create New Course
            </Button>
          )}
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <h4>No Courses Found</h4>
            <p>
              {showBannedCourses
                ? "No banned courses found."
                : "You haven't created any active courses yet."}
            </p>
            {!showBannedCourses && (
              <Button variant="primary" onClick={handleShow}>
                <FaBook className="me-2" /> Create Your First Course
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {filteredCourses.map((course) => (
            <Col md={6} lg={4} key={course._id} className="mb-4">
              <Card className="h-100 course-card">
                {course.image && (
                  <div className="course-image-container">
                    <Card.Img
                      variant="top"
                      src={`http://localhost:9999${course.image}`}
                      alt={course.title}
                      className="course-image"
                      onError={(e) =>
                        (e.target.src = "/path/to/fallback-image.jpg")
                      }
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
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleViewCourse(course._id)}
                    >
                      <FaEye className="me-1" /> View
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => handleEditCourse(course)}
                    >
                      <FaEdit className="me-1" /> Edit
                    </Button>
                    {course.completionStatus === "BANNED" ? (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleShowConfirmModal(course, true)}
                      >
                        <FaUndo className="me-1" /> Unban
                      </Button>
                    ) : (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleShowConfirmModal(course, false)}
                      >
                        <FaTrash className="me-1" /> Ban
                      </Button>
                    )}
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={handleCloseConfirmModal} centered>
        <Modal.Header
          closeButton
          className={`bg-gradient-to-r ${
            isUnbanAction
              ? "from-blue-500 to-cyan-600"
              : "from-red-500 to-pink-600"
          }`}
        >
          <Modal.Title className="text-white">
            {isUnbanAction ? "Confirm Unban Course" : "Confirm Ban Course"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-gray-50">
          {apiError && (
            <div className="alert alert-danger" role="alert">
              {apiError}
            </div>
          )}
          <p>
            Are you sure you want to {isUnbanAction ? "unban" : "ban"} the
            course <strong>{courseToBan?.title || "this course"}</strong>? This
            action will set its completion status to{" "}
            {isUnbanAction ? "INCOMPLETE" : "BANNED"}.
          </p>
        </Modal.Body>
        <Modal.Footer className="bg-gray-100">
          <Button
            variant="secondary"
            onClick={handleCloseConfirmModal}
            className="rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium"
            disabled={isUpdatingStatus}
          >
            Cancel
          </Button>
          <Button
            variant={isUnbanAction ? "primary" : "danger"}
            onClick={() =>
              handleUpdateStatus(isUnbanAction ? "INCOMPLETE" : "BANNED")
            }
            className={`rounded-lg ${
              isUnbanAction
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-red-600 hover:bg-red-700"
            } text-white font-medium`}
            disabled={isUpdatingStatus}
          >
            {isUpdatingStatus ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                {isUnbanAction ? "Unbanning..." : "Banning..."}
              </>
            ) : isUnbanAction ? (
              "Confirm Unban"
            ) : (
              "Confirm Ban"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create Course Modal */}
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

      {/* Edit Course Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header
          closeButton
          className="bg-gradient-to-r from-green-500 to-teal-600"
        >
          <Modal.Title className="text-white">Edit Course</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-gray-50">
          {editApiError && (
            <div className="alert alert-danger" role="alert">
              {editApiError}
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
                value={editFormData.title}
                onChange={handleEditInputChange}
                isInvalid={!!errors.title}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500"
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
                value={editFormData.description}
                onChange={handleEditInputChange}
                isInvalid={!!errors.description}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500"
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
                onChange={handleEditInputChange}
                isInvalid={!!errors.image}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500"
              />
              <Form.Text className="text-muted">
                Leave empty to keep current image
              </Form.Text>
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
                value={editFormData.price}
                onChange={handleEditInputChange}
                isInvalid={!!errors.price}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500"
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
                onChange={handleEditInputChange}
                isInvalid={!!errors.shortIntroVideo}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500"
              />
              <Form.Text className="text-muted">
                Leave empty to keep current video
              </Form.Text>
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
                value={editFormData.categoryId}
                onChange={handleEditInputChange}
                isInvalid={!!errors.categoryId}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500"
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
            onClick={handleCloseEditModal}
            className="rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium"
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleEditSubmit}
            disabled={isEditSubmitting}
            className="rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium"
          >
            {isEditSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Updating...
              </>
            ) : (
              "Update Course"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Course Detail Modal */}
      <Modal
        show={showDetailModal}
        onHide={handleCloseDetailModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>{selectedCourse?.title || "Course Details"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailError && (
            <div className="alert alert-danger" role="alert">
              {detailError}
            </div>
          )}

          {selectedCourse && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  {selectedCourse.image && (
                    <img
                      src={`http://localhost:9999${selectedCourse.image}`}
                      alt={selectedCourse.title}
                      className="img-fluid rounded"
                      onError={(e) =>
                        (e.target.src = "/path/to/fallback-image.jpg")
                      }
                    />
                  )}
                </Col>
                <Col md={6}>
                  <div className="d-flex mb-2">
                    <Badge
                      bg={
                        selectedCourse.status === "APPROVED"
                          ? "success"
                          : selectedCourse.status === "PENDING"
                          ? "warning"
                          : "danger"
                      }
                      className="me-2"
                    >
                      {selectedCourse.status || "N/A"}
                    </Badge>
                    <Badge bg="info">
                      {selectedCourse.categoryId?.name || "Uncategorized"}
                    </Badge>
                  </div>

                  <h5 className="mt-3">Price</h5>
                  <p className="fs-4">${selectedCourse.price || 0}</p>

                  {selectedCourse.shortIntroVideo && (
                    <Button
                      variant="primary"
                      className="mt-3"
                      onClick={handlePlayVideo}
                    >
                      <FaPlay className="me-2" /> Watch Intro Video
                    </Button>
                  )}
                </Col>
              </Row>

              <h4 className="mb-3 mt-4">Description</h4>
              <p>{selectedCourse.description || "No description available"}</p>

              <Row className="mt-4">
                <Col md={6}>
                  <h5>Created At</h5>
                  <p>{new Date(selectedCourse.createdAt).toLocaleString()}</p>
                </Col>
                <Col md={6}>
                  <h5>Last Updated</h5>
                  <p>{new Date(selectedCourse.updatedAt).toLocaleString()}</p>
                </Col>
              </Row>

              <h5 className="mt-3">Teacher ID</h5>
              <p>{selectedCourse.teacherId}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Video Player Modal */}
      {selectedCourse && (
        <Modal
          show={showVideoModal}
          onHide={handleCloseVideoModal}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{selectedCourse.title} - Introduction</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <div className="ratio ratio-16x9">
              {selectedCourse.shortIntroVideo && (
                <video
                  controls
                  autoPlay
                  src={`http://localhost:9999${selectedCourse.shortIntroVideo}`}
                  poster={
                    selectedCourse.image
                      ? `http://localhost:9999${selectedCourse.image}`
                      : ""
                  }
                  className="w-100"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default MyCourses;
