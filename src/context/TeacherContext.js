// TeacherContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const TeacherContext = createContext();

export const useTeacher = () => useContext(TeacherContext);

export const TeacherProvider = ({ children }) => {
  const { idLogin } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFetched, setIsFetched] = useState(false); // Add flag to track if data is fetched

  const fetchTeacherCourses = async () => {
    if (!idLogin) {
      console.log("Cannot fetch courses: idLogin is missing", { idLogin });
      return;
    }

    // Fetch token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Cannot fetch courses: token is missing");
      setError("No authentication token found");
      return;
    }

    // Skip fetch if data is already loaded
    if (isFetched) {
      console.log("Courses already fetched, skipping...");
      return;
    }

    console.log("Fetching courses for teacher ID:", idLogin);

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:9999/api/coursesTeacher/course/${idLogin}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      console.log("Courses API response:", data);

      if (res.ok && data.success) {
        setCourses(data.data || []);
        setIsFetched(true); // Mark as fetched
        return data.data?.length || 0;
      } else {
        setError(data.message || "Failed to fetch courses");
        return 0;
      }
    } catch (err) {
      setError("Error fetching courses data: " + err.message);
      console.error("Error fetching courses data:", err);
      return 0;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idLogin) {
      fetchTeacherCourses();
    }
  }, [idLogin]); // Depend on idLogin

  const value = {
    courses,
    loading,
    error,
    fetchTeacherCourses,
  };

  return (
    <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>
  );
};

export default TeacherContext;
