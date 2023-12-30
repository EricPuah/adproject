import React, { useState, useEffect } from 'react';
import styles from './AdminProfileEdit.module.css';
import style from './AdminNavBar.module.css';
import AdminNavbar from './AdminNavbar';
import { ref, get, update, query, orderByChild, equalTo, onValue, set } from 'firebase/database';
import { db } from './../firebase';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { searchUserProfile } from './../firebase';

function AdminProfileEdit() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [staffID, setStaffID] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            // Fetch data from localStorage
            const cookieData = Cookies.get('_auth_state');
            if (cookieData) {
                const adminData = JSON.parse(cookieData);
                const userProfileData = await searchUserProfile(adminData.username);

                // Set the username, email, and phone in the state
                setUsername(userProfileData.username);
                setEmail(userProfileData.email);
                setPhone(userProfileData.phone);
                setStaffID(userProfileData.staffId);

                // Fetch additional data from Firebase based on the username
                // const username = adminData.username; // Replace with the actual username
                // fetchUserData(username);
            } else {
                console.error('Admin data not found in localStorage');
            }
        };

        fetchData(); // Call the async function

    }, []); // The dependency array is empty since we only want to run this effect once


    const fetchUserData = async (username) => {
        try {
            // Retrieve data from Firebase based on username
            const userRef = ref(db, 'Admin');
            const userquery = query(userRef, orderByChild('username'), equalTo(username));

            const snapshot = await get(userquery);

            if (snapshot.exists()) {
                const userDataValue = snapshot.val();

                // Assuming there's only one matching user, use Object.values to get the first user
                const adminData = Object.values(userDataValue)[0];

                if (adminData.username === username) {
                    const adminKey = Object.keys(userDataValue)[0];

                    await update(ref(db, `Admin/${adminKey}`), {
                        email: email,
                        phone: phone,
                    });

                    localStorage.setItem('adminData', JSON.stringify({
                        ...adminData,
                        email: email,
                        phone: phone,
                    }));
                }
            } else {
                console.error('User data not found in Firebase');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const updateProfile = async () => {
        await fetchUserData(username);
        window.location.reload(true);
    };

    const isValidEmail = (email) => {
        // You can use a regular expression for basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <div>
            <AdminNavbar />
            <div className={style.mainContentContainer}>
                <div className={styles.box}>
                    <form>
                        <div className={styles.adminprofile}>
                            <h1 className={styles.heading}>Edit Profile Information</h1>
                            <label className={styles.label}>Username: </label>
                            <label className={styles.username}>{username}</label>
                            <label className={styles.label}>UTM StaffID: </label>
                            <label className={styles.username}>{staffID}</label>
                            <label className={styles.label}>Email: </label>
                            <input className={styles.input} type='text' name='email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                            <label className={styles.label}>Phone Number: </label>
                            <input className={styles.input} type='text' name='phone' value={phone} onChange={(e) => setPhone(e.target.value)}></input>
                            {!email || !isValidEmail(email) ? (
                                <Link to="/AdminProfileEdit">
                                    <button className={styles.button} type="button" onClick={() => alert('Please enter a valid email address.')}>Save</button>
                                </Link>
                            ) : (
                                <Link to="/AdminProfile">
                                    <button className={styles.button} type="button" onClick={updateProfile}>Save</button>
                                </Link>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminProfileEdit;
{/* Conditional rendering based on email validation */ }
