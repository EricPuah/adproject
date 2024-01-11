import { useState, useEffect } from 'react';
import styles from './AdminProfile.module.css';
import style from './AdminNavBar.module.css';
import { Link } from 'react-router-dom';
import AdminProfileEdit from './AdminProfileEdit';
import AdminNavbar from './AdminNavbar';
import Cookies from 'js-cookie';
import { searchUserProfile, getProfilePic } from '../firebase';

const AdminProfile = () => {
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchProfilePicUrl = async () => {
      try {
        const url = await getProfilePic(data.username);
        setProfilePicUrl(url);
      } catch (error) {
        console.error('Error fetching profile pic URL:', error);
      }
    };

    const fetchData = async () => {
      try {
        const cookieData = JSON.parse(Cookies.get('_auth_state'));
        if (cookieData) {
          const cookieUsername = cookieData.username;
          const userProfileData = await searchUserProfile(cookieUsername);
          setData(userProfileData);
        } else {
          console.error('Admin data not found in localStorage');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchProfilePicUrl();
    fetchData();
  }, []);

  console.log(data);

  return (
    <div>
      <AdminNavbar />
      <div className={style.mainContentContainer}>
        <div className={styles.box}>
          <div className={styles.container}>
            <h1 className={styles.heading}>Your Profile Information</h1>
            {profilePicUrl && <img src={profilePicUrl} alt="Profile Pic" width={200} height={200}/>}
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
                <Link to={'/ProfileInformationEdit'}>
                  <button className={styles.button}>Edit Profile</button>
                </Link>
                <Link
                  to={`/changepassword?email=${data.email}&code=${data.userKey}`}
                >
                  <button className={styles.buttonch}>Change Password</button>
                </Link>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
