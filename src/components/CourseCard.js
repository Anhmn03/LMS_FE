import React from 'react';

const CourseCard = ({ title, code }) => {
  return (
    <div className="course-card">
      <h5>{title}</h5>
      <p>{code}</p>
    </div>
  );
};

export default CourseCard;