import React, { Component } from 'react';
import styles from './AdminProfile.module.css';
import { Link } from 'react-router-dom';
import AdminProfileEdit from './AdminProfileEdit';
import AdminNavbar from './AdminNavbar';
import Cookies from 'js-cookie';
import { searchUserProfile } from '../firebase';

class AdminProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
    };
  }

  async componentDidMount() {
    try {
      const cookieData = JSON.parse(Cookies.get('_auth_state'));
      if (cookieData) {
        const cookieUsername = cookieData.username;
        const userProfileData = await searchUserProfile(cookieUsername);
        this.setState({ data: userProfileData });
      } else {
        console.error('Admin data not found in localStorage');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  render() {
    const { data } = this.state;
    console.log(data);

    return (
      <div>
        <AdminNavbar />
        <div className={styles.box}>
          <div className={styles.container}>
            <h1 className={styles.heading}>Your Profile Information</h1>
            <ul className={styles.list}>
              <div>
                <label className={styles.label}>Username: </label>
                <li className={styles.listItem}>{data.username}</li>
                <label className={styles.label}>UTM StaffID: </label>
                <li className={styles.listItem}>{data.staffId}</li>
                <label className={styles.label}>Email: </label>
                <li className={styles.listItem}>{data.email}</li>
                <label className={styles.label}>Phone Number: </label>
                <li className={styles.listItem}>{data.phone}</li>
                <Link to={'/AdminEditProfile'}>
                  <button className={styles.button}>Edit Profile</button>
                </Link>
                <Link to={`/changepassword?email=${data.email}&code=${data.userKey}`}>
                  <button className={styles.buttonch}>Change Password</button>
                </Link>
              </div>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminProfile;
