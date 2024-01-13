import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './UserSideBar.module.css';
import { AiOutlineDashboard } from 'react-icons/ai';
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineFeedback } from "react-icons/md";
import { MdOutlineReportProblem } from "react-icons/md";
import { CiLogin } from "react-icons/ci";
import { MdSchedule } from "react-icons/md";

function UserSideBar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
      <button className={styles.toggleButton} onClick={toggleSidebar}>
        ☰
      </button>
      <ul>
        <li className={styles.dashboard}>
          <AiOutlineDashboard className={styles.dashboardicon} />Dashboard
        </li>

        <li className={styles.list}>
          <Link to='/UserMap' className={styles.hover}>
            <FaLocationDot className={styles.mapsicon} />Nearby
          </Link>
        </li>

        <li className={styles.list}>
          <Link to='/UserBusSchedule' className={styles.hover}>
            <MdSchedule className={styles.routesicon} />Bus Schedule
          </Link>
        </li>

        <li className={styles.list}>
          <Link to='/UserFeedback' className={styles.hover}>
            <MdOutlineFeedback className={styles.routesicon} />Feedback
          </Link>
        </li>

        <li className={styles.list}>
          <Link to='/UserReport' className={styles.hover}>
            <MdOutlineReportProblem className={styles.routesicon} />Report
          </Link>
        </li>

        <li className={styles.list}>
          <Link to='/login' className={styles.hover}>
            <CiLogin className={styles.routesicon} />Admin Login
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default UserSideBar;
