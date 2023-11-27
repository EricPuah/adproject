import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import styles from './AdminNavBar.module.css'
import { AiOutlineDashboard } from "react-icons/ai";
import { TbMapSearch } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { MdManageAccounts } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";

class AdminNavbar extends Component {
    handleLogout = () => {
        localStorage.removeItem('adminData');
    }

    render() {
        return (
            <div className={styles.verticalnavbar}>
                <ul className={styles.navbarlist}>
                    <li className={styles.dashboard}><AiOutlineDashboard className={styles.dashboardicon} />Dashboard</li>
                    <li className={styles.list}><TbMapSearch className={styles.mapsicon} /><Link to='/AdminMaps' className={styles.hover}>Maps</Link></li>
                    <li className={styles.list}><CgProfile className={styles.profileicon} /><Link to='/AdminManage' className={styles.hover}>Manage Admin</Link></li>
                    <li className={styles.list}><Link to='/AdminProfile' className={styles.hover}><MdManageAccounts className={styles.manageicon}/>Profile</Link></li>
                    <li className={styles.list}><Link to='/login' className={styles.logout} onClick={this.handleLogout}><IoMdLogOut className={styles.logouticon}/>Logout</Link></li>
                </ul>
            </div>
        )
    }
}

export default AdminNavbar

