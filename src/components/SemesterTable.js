import React from 'react';

const SemesterTable = () => {
  const semesters = [
    { semester: 'Semester 01', module: 'Module 01', status: 'Completed' },
    { semester: 'Semester 02', module: 'Programming', status: 'Ongoing' },
    { semester: 'Semester 03', module: 'Database', status: 'Pending' },
    { semester: 'Semester 04', module: 'Professional Practice', status: 'Pending' },
  ];

  return (
    <div className="semester-table">
      <table>
        <thead>
          <tr>
            <th>Semester 01</th>
            <th>Semester 02</th>
            <th>Semester 03</th>
            <th>Semester 04</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {semesters.map((sem, index) => (
            <tr key={index}>
              <td>{sem.semester === 'Semester 01' ? sem.module : ''}</td>
              <td>{sem.semester === 'Semester 02' ? sem.module : ''}</td>
              <td>{sem.semester === 'Semester 03' ? sem.module : ''}</td>
              <td>{sem.semester === 'Semester 04' ? sem.module : ''}</td>
              <td>{sem.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SemesterTable;