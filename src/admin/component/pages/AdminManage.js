import React, { useState, useEffect } from 'react';
import styles from './AdminManage.module.css'; // Import the CSS file
import AdminNavbar from './AdminNavbar';
import { ref, onValue, query, orderByChild, equalTo, get, remove } from 'firebase/database';
import { db } from './../firebase';
import { Link } from 'react-router-dom';

function AdminManage() {
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        // Fetch all admins from Firebase
        const adminsRef = ref(db, 'Admin');

        onValue(adminsRef, (snapshot) => {
            if (snapshot.exists()) {
                // Convert the snapshot value to an array of admins
                const adminsData = Object.values(snapshot.val());
                setAdmins(adminsData);
            } else {
                console.error('No admins found in Firebase');
            }
        });
    }, []);

    const handleDeleteAdmin = async (username) => {
        try {
            const adminRef = ref(db, 'Admin');
            const adminquery = query(adminRef, orderByChild('username'), equalTo(username));
            const snapshot = await get(adminquery);

            if (snapshot.exists()) {
                const adminData = Object.values(snapshot.val())[0];
                const adminKey = Object.keys(snapshot.val())[0];

                await remove(ref(db, `Admin/${adminKey}`))
            }

        } catch (error) {
            console.error('Error deleting admin:', error);
        }
    }

    const rootAdmin = JSON.parse(localStorage.getItem('adminData'));
    const adminStatus = rootAdmin.isRootAdmin;

    console.log('adminStatus:', adminStatus);

    if (adminStatus) {
        return (
            <div>
                <AdminNavbar />
                <div className={styles.container}>
                    <div className={styles.listcontainer}>
                        <h2 className={styles.listtitle}>Admins List</h2>
                        <table className={styles.listtable}>
                            <thead>
                                <tr>
                                    <th className={styles.header}>No.</th>
                                    <th className={styles.header}>Name</th>
                                    <th className={styles.header}>Email</th>
                                    <th className={styles.header}>Phone</th>
                                    <th className={styles.header}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.filter(admin => !admin.isRootAdmin).map((admin, index) => (
                                    <tr key={index} className={styles.listitem}>
                                        <td className={styles.data}>{index + 1}</td>
                                        <td className={styles.data}>
                                            <span className={styles.detaillabel}>Name:</span> {admin.username}
                                        </td>
                                        <td className={styles.data}>
                                            <span className={styles.detaillabel}>Email:</span> {admin.email}
                                        </td>
                                        <td className={styles.data}>
                                            <span className={styles.detaillabel}>Phone:</span> {admin.phone}
                                        </td>
                                        {!(admin.isRootAdmin) && (
                                            <td className={styles.data}>
                                                <button className={styles.deletebutton} onClick={() => handleDeleteAdmin(admin.username)}>Delete</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className={styles.addadminbuttoncontainer}>
                            <Link to={'/AddNewAdmin'}>
                                <button className={styles.addadminbutton}>Add Admin</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <AdminNavbar />
                <div className={styles.container}>
                    <div className={styles.listcontainer}>
                        <h2 className={styles.listtitle}>Admins List</h2>
                        <table className={styles.listtable}>
                            <thead>
                                <tr>
                                    <th className={styles.header}>No.</th>
                                    <th className={styles.header}>Name</th>
                                    <th className={styles.header}>Email</th>
                                    <th className={styles.header}>Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.filter(admin => !admin.isRootAdmin).map((admin, index) => (
                                    <tr key={index} className={styles.listitem}>
                                        <td className={styles.data}>{index + 1}</td>
                                        <td className={styles.data}>
                                            <span className={styles.detaillabel}>Name:</span> {admin.username}
                                        </td>
                                        <td className={styles.data}>
                                            <span className={styles.detaillabel}>Email:</span> {admin.email}
                                        </td>
                                        <td className={styles.data}>
                                            <span className={styles.detaillabel}>Phone:</span> {admin.phone}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }


}

export default AdminManage;
