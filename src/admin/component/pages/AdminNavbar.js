import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import styles from './AdminNavBar.module.css';
import { AiOutlineDashboard } from 'react-icons/ai';
import { TbMapSearch } from 'react-icons/tb';
import { CgProfile } from 'react-icons/cg';
import { MdManageAccounts } from 'react-icons/md';
import { IoMdLogOut } from 'react-icons/io';
import { useSignOut } from 'react-auth-kit';
import { GrFormSchedule } from "react-icons/gr";
import Cookies from 'js-cookie';

const AdminNavbar = () => {
  const signOut = useSignOut();

  const cookieData = JSON.parse(Cookies.get('_auth_state'));
  const user_isRootAdmin = cookieData.isRootAdmin;
  const userRole = cookieData.role;

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className={styles.verticalnavbar}>
      <ul className={styles.navbarlist}>
        <li className={styles.dashboard}>
          <AiOutlineDashboard className={styles.dashboardicon} />Dashboard
        </li>
        <li className={styles.list}>
          <TbMapSearch className={styles.mapsicon} />
          <Link to='/AdminMaps' className={styles.hover}>
            Maps
          </Link>
        </li>

        {user_isRootAdmin ? (
          <li className={styles.list}>
            <CgProfile className={styles.profileicon} />
            <Link to='/AdminManage' className={styles.hover}>
              Manage Admin
            </Link>
          </li>
        ) : null}

        {userRole === "admin" ? (
          <li className={styles.list}>
            <CgProfile className={styles.profileicon} />
            <Link to='/AdminManageBus' className={styles.hover}>
              Manage Bus Driver
            </Link>
          </li>
        ) : null}

        <li className={styles.list}>
          <Link to='/AdminProfile' className={styles.hover}>
            <MdManageAccounts className={styles.manageicon} />Profile
          </Link>
        </li>
        <li className={styles.list}>
          <Link to='/login' className={styles.logout} onClick={handleLogout}>
            <IoMdLogOut className={styles.logouticon} />Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminNavbar;
