import React, { createContext, useContext, useState, useEffect } from "react";

const AdminDataContext = createContext();

export const AdminDataProvider = ({ children }) => {
  const [stats, setStats] = useState({ teachers: 0, students: 0, courses: 0 });
  const [mostEnrolledCourses, setMostEnrolledCourses] = useState([]);
  const [teachersData, setTeachersData] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:9999/api/users/teachers", {
        // method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTeachersData(data.users || []);
      return data.users?.length || 0;
    } catch (err) {
      setError("Error fetching teachers data");
      console.error("Error fetching teachers data:", err);
      return 0;
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:9999/api/users/students", {
        // method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStudentsData(data.users || []);
      return data.users?.length || 0;
    } catch (err) {
      setError("Error fetching students data");
      console.error("Error fetching students data:", err);
      return 0;
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:9999/api/courses", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCoursesData(data.courses || []);
      return data.courses?.length || 0;
    } catch (err) {
      setError("Error fetching courses data");
      console.error("Error fetching courses data:", err);
      return 0;
    }
  };

  const fetchMostEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:9999/api/courses/most-enrolled",
        {
            method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setMostEnrolledCourses(data.courses || []);
    } catch (err) {
      setError("Error fetching most enrolled courses");
      console.error("Error fetching most enrolled courses:", err);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    const teachersCount = await fetchTeachers();
    const studentsCount = await fetchStudents();
    const coursesCount = await fetchCourses();

    setStats({
      teachers: teachersCount,
      students: studentsCount,
      courses: coursesCount,
    });

    await fetchMostEnrolledCourses();
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <AdminDataContext.Provider
      value={{
        stats,
        mostEnrolledCourses,
        loading,
        error,
        teachersData,
        studentsData,
        coursesData,
        fetchTeachers,
        fetchStudents,
        fetchCourses,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => useContext(AdminDataContext);
