import React, { Component, useState, useEffect } from 'react'
import './AdminProfile.css'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import AdminProfileEdit from './AdminProfileEdit';
import AdminNavbar from './AdminNavbar';


class AdminProfile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: {},
    }
  }

  componentDidMount() {
    const adminDataString = localStorage.getItem('adminData');

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
        <div className='box'>
          <div className='container'>
            <h1 className="heading">Admin Profile</h1>
            <ul className='list'>
              <div>
                <li className='listItem'>Admin Name : {data.username}</li>
                <li className='listItem'>Email : {data.email}</li>
                <li className='listItem'>Phone Number : {data.phone}</li>
                <Link to={'/AdminProfileEdit'}>
                  <button>Edit</button>
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
