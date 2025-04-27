// components/dashboard/RevenueContainer.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import {
  RevenueOverview,
  RevenueBarChart,
  EnrollmentPieChart,
  TeacherRevenueChart,
  PaymentCountChart,
} from "./RevenueComponents";

const RevenueContainer = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRevenueData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      // Fetch revenue statistics
      const revenueRes = await fetch(
        "http://localhost:9999/api/statictis/courses",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch enrollment statistics
      const enrollmentRes = await fetch(
        "http://localhost:9999/api/statictis/enroll",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!revenueRes.ok || !enrollmentRes.ok) {
        throw new Error(
          `HTTP error! Status: ${revenueRes.status || enrollmentRes.status}`
        );
      }

      const revenueData = await revenueRes.json();
      const enrollmentData = await enrollmentRes.json();

      setRevenueData(revenueData.stats || []);
      setEnrollmentData(enrollmentData.stats || []);
    } catch (err) {
      setError("Lỗi khi tải dữ liệu doanh thu. Vui lòng thử lại sau.");
      console.error("Error fetching revenue data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Đang tải dữ liệu doanh thu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-4">
        {error}
      </Alert>
    );
  }

  return (
    <Container fluid className="revenue-dashboard">
      {/* Revenue Overview Stats */}
      <RevenueOverview
        revenueStats={revenueData}
        enrollmentStats={enrollmentData}
        loading={loading}
        onRefresh={fetchRevenueData}
      />

      <Row>
        {/* Revenue Bar Chart */}
        <Col md={6}>
          <RevenueBarChart revenueStats={revenueData} loading={loading} />
        </Col>

        {/* Enrollment Pie Chart */}
        <Col md={6}>
          <EnrollmentPieChart
            enrollmentStats={enrollmentData}
            loading={loading}
          />
        </Col>
      </Row>

      <Row>
        {/* Teacher Revenue Chart */}
        <Col md={6}>
          <TeacherRevenueChart revenueStats={revenueData} loading={loading} />
        </Col>

        {/* Payment Count Chart */}
        <Col md={6}>
          <PaymentCountChart revenueStats={revenueData} loading={loading} />
        </Col>
      </Row>
    </Container>
  );
};

export default RevenueContainer;
