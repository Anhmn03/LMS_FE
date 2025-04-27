// components/dashboard/RevenueComponents.js
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Alert, Button } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { FaSync } from "react-icons/fa";

// Chart color palette
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export const RevenueOverview = ({
  revenueStats,
  enrollmentStats,
  loading,
  onRefresh,
}) => {
  // Calculate total revenue from all courses
  const totalRevenue =
    revenueStats?.reduce(
      (sum, course) => sum + parseFloat(course.totalRevenue),
      0
    ) || 0;

  // Calculate total enrollments
  const totalEnrollments =
    enrollmentStats?.reduce(
      (sum, course) => sum + parseInt(course.enrollmentCount),
      0
    ) || 0;

  // Count total courses with revenue
  const totalCourses = revenueStats?.length || 0;

  // Calculate average revenue per course
  const avgRevenue =
    totalCourses > 0 ? (totalRevenue / totalCourses).toFixed(2) : 0;

  return (
    <Row className="mb-4">
      <Col className="d-flex justify-content-between align-items-center mb-3">
        <h3>Báo cáo doanh thu</h3>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
        >
          <FaSync className={loading ? "spin" : ""} /> Refresh
        </Button>
      </Col>

      <Col md={3}>
        <Card className="stats-card">
          <Card.Body>
            <h5>Tổng Doanh Thu</h5>
            <h3>{totalRevenue.toLocaleString()} đ</h3>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="stats-card">
          <Card.Body>
            <h5>Tổng Ghi Danh</h5>
            <h3>{totalEnrollments}</h3>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="stats-card">
          <Card.Body>
            <h5>Số Khóa Học Bán</h5>
            <h3>{totalCourses}</h3>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="stats-card">
          <Card.Body>
            <h5>Thu Nhập/Khóa Học</h5>
            <h3>{parseFloat(avgRevenue).toLocaleString()} đ</h3>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export const RevenueBarChart = ({ revenueStats, loading }) => {
  // Sort courses by revenue (descending)
  const sortedData = [...(revenueStats || [])]
    .sort((a, b) => parseFloat(b.totalRevenue) - parseFloat(a.totalRevenue))
    .slice(0, 5); // Take top 5 courses

  // Format data for chart
  const chartData = sortedData.map((course) => ({
    name: course.courseTitle,
    revenue: parseFloat(course.totalRevenue),
  }));

  if (loading) {
    return <div className="text-center py-5">Loading chart data...</div>;
  }

  if (chartData.length === 0) {
    return (
      <Alert variant="info">Không có dữ liệu doanh thu để hiển thị.</Alert>
    );
  }

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Top 5 khóa học có doanh thu cao nhất</Card.Title>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toLocaleString()} đ`} />
            <Legend />
            <Bar dataKey="revenue" name="Doanh thu (đ)" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export const EnrollmentPieChart = ({ enrollmentStats, loading }) => {
  // Format data for pie chart
  const chartData =
    enrollmentStats?.map((course, index) => ({
      name: course.courseTitle,
      value: parseInt(course.enrollmentCount),
    })) || [];

  if (loading) {
    return <div className="text-center py-5">Loading chart data...</div>;
  }

  if (chartData.length === 0) {
    return <Alert variant="info">Không có dữ liệu ghi danh để hiển thị.</Alert>;
  }

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Phân bố ghi danh theo khóa học</Card.Title>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} ghi danh`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export const TeacherRevenueChart = ({ revenueStats, loading }) => {
  // Group courses by teacher name and sum their revenues
  const teacherRevenue =
    revenueStats?.reduce((acc, course) => {
      const { teacherName, totalRevenue } = course;
      if (!acc[teacherName]) {
        acc[teacherName] = 0;
      }
      acc[teacherName] += parseFloat(totalRevenue);
      return acc;
    }, {}) || {};

  // Format data for chart
  const chartData = Object.entries(teacherRevenue).map(([name, revenue]) => ({
    name,
    revenue,
  }));

  if (loading) {
    return <div className="text-center py-5">Loading chart data...</div>;
  }

  if (chartData.length === 0) {
    return (
      <Alert variant="info">
        Không có dữ liệu doanh thu giảng viên để hiển thị.
      </Alert>
    );
  }

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Doanh thu theo giảng viên</Card.Title>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
            />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toLocaleString()} đ`} />
            <Legend />
            <Bar dataKey="revenue" name="Doanh thu (đ)" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export const PaymentCountChart = ({ revenueStats, loading }) => {
  // Sort data by payment count
  const sortedData = [...(revenueStats || [])]
    .sort((a, b) => parseInt(b.paymentCount) - parseInt(a.paymentCount))
    .slice(0, 5); // Take top 5

  // Format data for chart
  const chartData = sortedData.map((course) => ({
    name: course.courseTitle,
    count: parseInt(course.paymentCount),
  }));

  if (loading) {
    return <div className="text-center py-5">Loading chart data...</div>;
  }

  if (chartData.length === 0) {
    return (
      <Alert variant="info">Không có dữ liệu thanh toán để hiển thị.</Alert>
    );
  }

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Số lượng thanh toán theo khóa học</Card.Title>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Số lượng thanh toán" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};
