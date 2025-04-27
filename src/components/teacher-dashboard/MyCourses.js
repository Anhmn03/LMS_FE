import React from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Badge,
  Spinner,
} from "react-bootstrap";
import { FaBook, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useTeacher } from "../../context/TeacherContext";

const MyCourses = () => {
  const { courses, loading, error, fetchTeacherCourses } = useTeacher();

  // Removed the useEffect that caused the infinite loop
  // Data is already fetched in TeacherContext when idLogin changes

  if (loading) {
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
        <Button variant="primary">
          <FaBook className="me-2" /> Create New Course
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <h4>No Courses Found</h4>
            <p>You haven't created any courses yet.</p>
            <Button variant="primary">
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
                      src={`/images/${course.image}`}
                      alt={course.title}
                      className="course-image"
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
    </Container>
  );
};

export default MyCourses;
