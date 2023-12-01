import React, { Component, useState, useEffect } from 'react'
import styles from './AdminProfile.module.css'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import AdminProfileEdit from './AdminProfileEdit';
import AdminNavbar from './AdminNavbar';
import Cookies from 'js-cookie';


class AdminProfile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: {},
    }
  }

  componentDidMount() {
    const adminDataString = Cookies.get('_auth_state');

    if (adminDataString) {
      const adminData = JSON.parse(adminDataString);
      this.setState({ data: adminData });
    } else {
      console.error('Admin data not found in localStorage');
    }
  }

  render() {
    const { data } = this.state;

    return (
      <div>
        <AdminNavbar />
        <div className={styles.box}>
          <div className={styles.container}>
            <h1 className={styles.heading}>Admin Profile</h1>
            <ul className={styles.list}>
              <div>
                <li className={styles.listItem}>Admin Name : {data.username}</li>
                <li className={styles.listItem}>Email : {data.email}</li>
                <li className={styles.listItem}>Phone Number : {data.phone}</li>
                <Link to={'/AdminProfileEdit'}>
                  <button className={styles.button}>Edit</button>
                </Link>
              </div>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default AdminProfile
