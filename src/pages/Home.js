import React from 'react';
import Sidebar from '../components/Sidebar';
import CourseCard from '../components/CourseCard';
import SemesterTable from '../components/SemesterTable';

const Home = () => {
  return (
    <div className="home-page">
      <Sidebar />
      <div className="main-content">
        <h2>My Courses</h2>
        <div className="courses">
          <CourseCard title="Diploma in English" code="OXF/ENG/001" />
          <CourseCard title="Diploma in IT" code="OXF/DIT/001" />
          <CourseCard title="HND in Computing" code="OXF/HND/001" />
        </div>
        <SemesterTable />
      </div>
    </div>
  );
};

export default Home;