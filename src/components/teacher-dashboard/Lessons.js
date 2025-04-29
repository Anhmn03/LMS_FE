import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Badge,
  Row,
  Col,
  Pagination,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import { FaEye, FaEdit, FaPlus } from "react-icons/fa";
import { useTeacher } from "../../context/TeacherContext";

const Lessons = () => {
  const { courses } = useTeacher();
  const [lessons, setLessons] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState({});
  const lessonsPerPage = 3;

  // State for Create Lesson Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    description: "",
    contentType: "video",
    contentURL: "",
    contentVideo: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // State for Edit Lesson Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    lessonId: "",
    courseId: "",
    title: "",
    description: "",
    contentType: "video",
    contentURL: "",
    contentVideo: null,
  });
  const [editFormErrors, setEditFormErrors] = useState({});
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editApiError, setEditApiError] = useState(null);

  // State for View Lesson Modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewLessonData, setViewLessonData] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState(null);

  const fetchLessons = async (courseId) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:9999/api/lessons/course/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      if (res.ok && data.success) {
        setLessons((prev) => ({ ...prev, [courseId]: data.lessons || [] }));
        setCurrentPage((prev) => ({ ...prev, [courseId]: 1 }));
      } else {
        setError(data.message || "Failed to fetch lessons");
      }
    } catch (err) {
      setError("Error fetching lessons: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessonDetails = async (lessonId) => {
    setViewLoading(true);
    setViewError(null);
    setViewLessonData(null);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:9999/api/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setViewLessonData(data.lesson);
      } else {
        setViewError(data.message || "Failed to fetch lesson details");
      }
    } catch (err) {
      setViewError("Error fetching lesson details: " + err.message);
    } finally {
      setViewLoading(false);
    }
  };

  useEffect(() => {
    courses.forEach((course) => {
      if (!lessons[course._id]) {
        fetchLessons(course._id);
      }
    });
  }, [courses]);

  const handleViewLesson = (lessonId) => {
    fetchLessonDetails(lessonId);
    setShowViewModal(true);
  };

  const handleEditLesson = (lesson) => {
    setEditFormData({
      lessonId: lesson._id,
      courseId: lesson.courseId,
      title: lesson.title || "",
      description: lesson.description || "",
      contentType: lesson.contentType || "video",
      contentURL: lesson.contentUrl || "",
      contentVideo: null,
    });
    setEditFormErrors({});
    setEditApiError(null);
    setShowEditModal(true);
  };

  const handleCreateLesson = (courseId) => {
    setSelectedCourseId(courseId);
    setFormData({
      courseId: courseId,
      title: "",
      description: "",
      contentType: "video",
      contentURL: "",
      contentVideo: null,
    });
    setFormErrors({});
    setApiError(null);
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setSelectedCourseId(null);
    setFormData({
      courseId: "",
      title: "",
      description: "",
      contentType: "video",
      contentURL: "",
      contentVideo: null,
    });
    setFormErrors({});
    setApiError(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditFormData({
      lessonId: "",
      courseId: "",
      title: "",
      description: "",
      contentType: "video",
      contentURL: "",
      contentVideo: null,
    });
    setEditFormErrors({});
    setEditApiError(null);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewLessonData(null);
    setViewError(null);
  };

  const validateForm = (isEdit = false) => {
    const data = isEdit ? editFormData : formData;
    const errors = isEdit ? setEditFormErrors : setFormErrors;
    const newErrors = {};
    const videoRegex = /\.(mp4|webm|ogg)$/i;
    const urlRegex = /\.(mp4|webm|ogg|pdf|doc|docx|ppt|pptx)$/i;

    if (!data.title) newErrors.title = "Title is required";
    if (data.title && data.title.length < 3)
      newErrors.title = "Lesson title must be at least 3 characters";
    if (data.title && data.title.length > 100)
      newErrors.title = "Lesson title cannot exceed 100 characters";
    if (!data.description) newErrors.description = "Description is required";
    if (data.description && data.description.length > 1000)
      newErrors.description = "Description cannot exceed 1000 characters";
    if (data.contentType === "video" && data.contentVideo) {
      if (!videoRegex.test(data.contentVideo.name)) {
        newErrors.contentVideo = "Video must be in mp4, webm, or ogg format";
      }
    }
    if (data.contentType === "document" && !data.contentURL) {
      newErrors.contentURL = "Document URL is required";
    }
    if (
      data.contentType === "document" &&
      data.contentURL &&
      !urlRegex.test(data.contentURL)
    ) {
      newErrors.contentURL =
        "Content URL must be a valid video or document format (mp4, webm, ogg, pdf, doc, docx, ppt, pptx)";
    }

    errors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createLesson = async () => {
    setIsSubmitting(true);
    setApiError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setApiError("No authentication token found");
      return false;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("courseId", formData.courseId);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("contentType", formData.contentType);
    if (formData.contentType === "video" && formData.contentVideo) {
      formDataToSend.append("contentVideo", formData.contentVideo);
    } else if (formData.contentType === "document") {
      formDataToSend.append("contentUrl", formData.contentURL);
    }

    try {
      const res = await fetch("http://localhost:9999/api/lessons", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        await fetchLessons(formData.courseId);
        return true;
      } else {
        setApiError(data.message || "Failed to create lesson");
        return false;
      }
    } catch (err) {
      setApiError("Error creating lesson: " + err.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateLesson = async () => {
    setIsEditSubmitting(true);
    setEditApiError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setEditApiError("No authentication token found");
      return false;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", editFormData.title);
    formDataToSend.append("description", editFormData.description);
    formDataToSend.append("contentType", editFormData.contentType);
    if (editFormData.contentType === "video" && editFormData.contentVideo) {
      formDataToSend.append("contentVideo", editFormData.contentVideo);
    } else if (editFormData.contentType === "document") {
      formDataToSend.append("contentUrl", editFormData.contentURL);
    }

    try {
      const res = await fetch(
        `http://localhost:9999/api/lessons/${editFormData.lessonId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );
      const data = await res.json();

      if (res.ok && data.success) {
        await fetchLessons(editFormData.courseId);
        return true;
      } else {
        setEditApiError(data.message || "Failed to update lesson");
        return false;
      }
    } catch (err) {
      setEditApiError("Error updating lesson: " + err.message);
      return false;
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleSubmitCreateLesson = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = await createLesson();
    if (success) {
      handleCloseCreateModal();
    }
  };

  const handleSubmitEditLesson = async (e) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    const success = await updateLesson();
    if (success) {
      handleCloseEditModal();
    }
  };

  const handleInputChange = (e, isEdit = false) => {
    const { name, value, files } = e.target;
    const setData = isEdit ? setEditFormData : setFormData;
    setData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handlePageChange = (courseId, pageNumber) => {
    setCurrentPage((prev) => ({ ...prev, [courseId]: pageNumber }));
  };

  return (
    <div className="lessons-container" style={{ padding: "20px" }}>
      <h2 className="mb-4" style={{ color: "#2c3e50", fontWeight: "bold" }}>
        Lessons
      </h2>
      {courses.length === 0 ? (
        <p className="text-muted">No courses available.</p>
      ) : (
        courses.map((course) => {
          const courseLessons = lessons[course._id] || [];
          const totalPages = Math.ceil(courseLessons.length / lessonsPerPage);
          const currentPageForCourse = currentPage[course._id] || 1;
          const startIndex = (currentPageForCourse - 1) * lessonsPerPage;
          const paginatedLessons = courseLessons.slice(
            startIndex,
            startIndex + lessonsPerPage
          );

          return (
            <div
              key={course._id}
              className="mb-5"
              style={{
                border: "1px solid #dee2e6",
                borderRadius: "10px",
                padding: "20px",
                backgroundColor: "#fff",
              }}
            >
              {course.image && (
                <div className="course-image-container mb-3">
                  <img
                    src={`http://localhost:9999${course.image}`}
                    alt={course.title}
                    className="img-fluid rounded"
                    style={{
                      maxHeight: "200px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                    onError={(e) =>
                      (e.target.src = "/path/to/fallback-image.jpg")
                    }
                  />
                </div>
              )}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <h4
                    style={{
                      color: "#2c3e50",
                      fontWeight: "500",
                      margin: 0,
                    }}
                  >
                    {course.title}
                  </h4>
                  <Badge
                    bg={course.status === "APPROVED" ? "success" : "warning"}
                    className="ms-2"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {course.status === "APPROVED" ? "APPROVED" : "PENDING"}
                  </Badge>
                </div>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleCreateLesson(course._id)}
                  style={{ borderRadius: "5px" }}
                >
                  <FaPlus /> Create Lesson
                </Button>
              </div>
              {loading && <p className="text-muted">Loading lessons...</p>}
              {error && <p className="text-danger">{error}</p>}
              {courseLessons.length > 0 ? (
                <>
                  <Row>
                    {paginatedLessons.map((lesson) => (
                      <Col
                        md={4}
                        sm={6}
                        xs={12}
                        key={lesson._id}
                        className="mb-4"
                      >
                        <Card
                          className="shadow-sm h-100"
                          style={{
                            borderRadius: "10px",
                            border: "none",
                            transition: "transform 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.02)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        >
                          <Card.Body>
                            <Card.Title
                              style={{ fontSize: "1.1rem", color: "#2c3e50" }}
                            >
                              {lesson.title}
                            </Card.Title>
                            <Card.Text className="text-muted">
                              {lesson.description}
                            </Card.Text>
                            <Card.Text>
                              <small className="text-muted">
                                Content Type: {lesson.contentType}
                              </small>
                            </Card.Text>
                            <div className="d-flex justify-content-end">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => handleViewLesson(lesson._id)}
                                style={{ borderRadius: "5px" }}
                              >
                                <FaEye /> View
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleEditLesson(lesson)}
                                style={{ borderRadius: "5px" }}
                              >
                                <FaEdit /> Edit
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-3">
                      <Pagination>
                        {Array.from({ length: totalPages }, (_, index) => (
                          <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentPageForCourse}
                            onClick={() =>
                              handlePageChange(course._id, index + 1)
                            }
                          >
                            {index + 1}
                          </Pagination.Item>
                        ))}
                      </Pagination>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted">
                  No lessons available for this course.
                </p>
              )}
            </div>
          );
        })
      )}

      {/* Create Lesson Modal */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal} centered>
        <Modal.Header
          closeButton
          className="bg-gradient-to-r from-blue-500 to-indigo-600"
        >
          <Modal.Title className="text-white">Create New Lesson</Modal.Title>
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
                Course ID
              </Form.Label>
              <Form.Control
                type="text"
                name="courseId"
                value={formData.courseId}
                readOnly
                className="mt-1 rounded-lg border-gray-300 shadow-sm bg-gray-100"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="font-medium text-gray-700">
                Lesson Title
              </Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                isInvalid={!!formErrors.title}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter lesson title"
              />
              <Form.Control.Feedback
                type="invalid"
                className="text-red-500 text-sm mt-1"
              >
                {formErrors.title}
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
                isInvalid={!!formErrors.description}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500"
                placeholder="Describe the lesson"
              />
              <Form.Control.Feedback
                type="invalid"
                className="text-red-500 text-sm mt-1"
              >
                {formErrors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label className="font-medium text-gray-700">
                Content Type
              </Form.Label>
              <Form.Control
                as="select"
                name="contentType"
                value={formData.contentType}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    contentType: e.target.value,
                    contentURL: "",
                    contentVideo: null,
                  }));
                }}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="video">video</option>
                <option value="document">document</option>
              </Form.Control>
            </Form.Group>

            {formData.contentType === "video" ? (
              <Form.Group>
                <Form.Label className="font-medium text-gray-700">
                  Upload Video (mp4, webm, ogg)
                </Form.Label>
                <Form.Control
                  type="file"
                  name="contentVideo"
                  accept=".mp4,.webm,.ogg"
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.contentVideo}
                  className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500"
                />
                <Form.Control.Feedback
                  type="invalid"
                  className="text-red-500 text-sm mt-1"
                >
                  {formErrors.contentVideo}
                </Form.Control.Feedback>
              </Form.Group>
            ) : (
              <Form.Group>
                <Form.Label className="font-medium text-gray-700">
                  Document URL
                </Form.Label>
                <Form.Control
                  type="text"
                  name="contentURL"
                  value={formData.contentURL}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.contentURL}
                  className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter document URL (e.g., https://example.com/doc.pdf)"
                />
                <Form.Control.Feedback
                  type="invalid"
                  className="text-red-500 text-sm mt-1"
                >
                  {formErrors.contentURL}
                </Form.Control.Feedback>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-gray-100">
          <Button
            variant="secondary"
            onClick={handleCloseCreateModal}
            className="rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium"
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitCreateLesson}
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
              "Create Lesson"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Lesson Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header
          closeButton
          className="bg-gradient-to-r from-green-500 to-teal-600"
        >
          <Modal.Title className="text-white">Edit Lesson</Modal.Title>
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
                Course ID
              </Form.Label>
              <Form.Control
                type="text"
                name="courseId"
                value={editFormData.courseId}
                readOnly
                className="mt-1 rounded-lg border-gray-300 shadow-sm bg-gray-100"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="font-medium text-gray-700">
                Lesson Title
              </Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editFormData.title}
                onChange={(e) => handleInputChange(e, true)}
                isInvalid={!!editFormErrors.title}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500"
                placeholder="Enter lesson title"
              />
              <Form.Control.Feedback
                type="invalid"
                className="text-red-500 text-sm mt-1"
              >
                {editFormErrors.title}
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
                onChange={(e) => handleInputChange(e, true)}
                isInvalid={!!editFormErrors.description}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500"
                placeholder="Describe the lesson"
              />
              <Form.Control.Feedback
                type="invalid"
                className="text-red-500 text-sm mt-1"
              >
                {editFormErrors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label className="font-medium text-gray-700">
                Content Type
              </Form.Label>
              <Form.Control
                as="select"
                name="contentType"
                value={editFormData.contentType}
                onChange={(e) => {
                  setEditFormData((prev) => ({
                    ...prev,
                    contentType: e.target.value,
                    contentURL: prev.contentURL,
                    contentVideo: null,
                  }));
                }}
                className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500"
              >
                <option value="video">video</option>
                <option value="document">document</option>
              </Form.Control>
            </Form.Group>

            {editFormData.contentType === "video" ? (
              <Form.Group>
                <Form.Label className="font-medium text-gray-700">
                  Upload Video (mp4, webm, ogg)
                </Form.Label>
                <Form.Control
                  type="file"
                  name="contentVideo"
                  accept=".mp4,.webm,.ogg"
                  onChange={(e) => handleInputChange(e, true)}
                  isInvalid={!!editFormErrors.contentVideo}
                  className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500"
                />
                <Form.Text className="text-muted">
                  Leave empty to keep the current video
                </Form.Text>
                <Form.Control.Feedback
                  type="invalid"
                  className="text-red-500 text-sm mt-1"
                >
                  {editFormErrors.contentVideo}
                </Form.Control.Feedback>
              </Form.Group>
            ) : (
              <Form.Group>
                <Form.Label className="font-medium text-gray-700">
                  Document URL
                </Form.Label>
                <Form.Control
                  type="text"
                  name="contentURL"
                  value={editFormData.contentURL}
                  onChange={(e) => handleInputChange(e, true)}
                  isInvalid={!!editFormErrors.contentURL}
                  className="mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter document URL (e.g., https://example.com/doc.pdf)"
                />
                <Form.Control.Feedback
                  type="invalid"
                  className="text-red-500 text-sm mt-1"
                >
                  {editFormErrors.contentURL}
                </Form.Control.Feedback>
              </Form.Group>
            )}
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
            onClick={handleSubmitEditLesson}
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
              "Update Lesson"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Lesson Modal */}
      <Modal
        show={showViewModal}
        onHide={handleCloseViewModal}
        centered
        size="lg"
      >
        <Modal.Header
          closeButton
          className="bg-gradient-to-r from-purple-500 to-pink-600"
        >
          <Modal.Title className="text-white">
            {viewLessonData ? viewLessonData.title : "View Lesson"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-gray-50">
          {viewLoading && (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}
          {viewError && (
            <div className="alert alert-danger" role="alert">
              {viewError}
            </div>
          )}
          {viewLessonData && (
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-700">Course ID</h5>
                <p className="text-gray-600">{viewLessonData.courseId}</p>
              </div>
              <div>
                <h5 className="font-medium text-gray-700">Title</h5>
                <p className="text-gray-600">{viewLessonData.title}</p>
              </div>
              <div>
                <h5 className="font-medium text-gray-700">Description</h5>
                <p className="text-gray-600">{viewLessonData.description}</p>
              </div>
              <div>
                <h5 className="font-medium text-gray-700">Content Type</h5>
                <p className="text-gray-600">{viewLessonData.contentType}</p>
              </div>
              <div>
                <h5 className="font-medium text-gray-700">Content</h5>
                {viewLessonData.contentType === "video" ? (
                  <video
                    controls
                    className="w-100 rounded"
                    style={{ maxHeight: "400px" }}
                  >
                    <source
                      src={`http://localhost:9999${viewLessonData.contentUrl}`}
                      type="video/mp4"
                    />
                    <source
                      src={`http://localhost:9999${viewLessonData.contentUrl}`}
                      type="video/webm"
                    />
                    <source
                      src={`http://localhost:9999${viewLessonData.contentUrl}`}
                      type="video/ogg"
                    />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <a
                    href={viewLessonData.contentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {viewLessonData.contentUrl}
                  </a>
                )}
              </div>
              <div>
                <h5 className="font-medium text-gray-700">Status</h5>
                <p className="text-gray-600">{viewLessonData.status}</p>
              </div>
              <div>
                <h5 className="font-medium text-gray-700">Created At</h5>
                <p className="text-gray-600">
                  {new Date(viewLessonData.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <h5 className="font-medium text-gray-700">Updated At</h5>
                <p className="text-gray-600">
                  {new Date(viewLessonData.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-gray-100">
          <Button
            variant="secondary"
            onClick={handleCloseViewModal}
            className="rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Lessons;
