import React, { createContext, useContext, useState, useEffect } from "react";

const AdminDataContext = createContext();

export const AdminDataProvider = ({ children }) => {
  const [stats, setStats] = useState({ teachers: 0, students: 0, courses: 0 });
  const [teachersData, setTeachersData] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch statistics data
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:9999/api/statictis/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();

      const studentsCount = data.stats[0]?.students || 0;
      const teachersCount = data.stats[0]?.teachers || 0;

      return { teachersCount, studentsCount };
    } catch (err) {
      setError("Error fetching statistics data");
      console.error("Error fetching statistics data:", err);
      return { teachersCount: 0, studentsCount: 0 };
    }
  };

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:9999/api/users/teachers", {
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

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:9999/api/category", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategoriesData(data.data || []);
      return data.data?.length || 0;
    } catch (err) {
      setError("Error fetching categories data");
      console.error("Error fetching categories data:", err);
      return 0;
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Get teachers and students count from statistics API
      const { teachersCount, studentsCount } = await fetchStats();

      // Get courses count from courses API
      const coursesCount = await fetchCourses();

      setStats({
        teachers: teachersCount,
        students: studentsCount,
        courses: coursesCount,
      });

      setLoading(false);
    } catch (err) {
      setError("Error fetching dashboard data");
      console.error("Error fetching dashboard data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <AdminDataContext.Provider
      value={{
        stats,
        loading,
        error,
        teachersData,
        studentsData,
        coursesData,
        categoriesData,
        fetchTeachers,
        fetchStudents,
        fetchCourses,
        fetchCategories,
        fetchAllData,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => useContext(AdminDataContext);
