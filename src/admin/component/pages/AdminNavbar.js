import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import './AdminNavBar.css'

class AdminNavbar extends Component {
    render() {
        return (
            <div className='vertical-navbar'>
                <ul className='navbar-list'>
                    <li><Link to='/AdminDashBoard'>Dashboard</Link></li>
                    <li><Link to='/AdminMaps'>Maps</Link></li>
                    <li><Link to='/AdminManage'>Manage Admin</Link></li>
                    <li><Link to='/AdminProfile'>Profile</Link></li>
                    <li><Link to='/AdminSettings'>Settings</Link></li>
                </ul>
            </div>
        )
    }
}

export default AdminNavbar

