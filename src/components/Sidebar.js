import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="https://via.placeholder.com/50" alt="Oxford Logo" />
        <h4>Hi, Alex</h4>
        <p>EI: 713037</p>
      </div>
      <ul className="sidebar-menu">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/courses">My Courses</Link></li>
        <li><Link to="/assignments">Assignments</Link></li>
        <li><Link to="/timetable">Time Table</Link></li>
        <li><Link to="/forum">Forum</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;