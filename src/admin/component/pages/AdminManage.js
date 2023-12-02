import React, { useState, useEffect } from 'react';
import styles from './AdminManageBus.module.css';
import AdminNavbar from './AdminNavbar';
import { ref, onValue, query, orderByChild, equalTo, get, remove } from 'firebase/database';
import { db } from './../firebase';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

function AdminManage() {
    const [admins, setAdmins] = useState([]);
    const [isRootAdmin, setisRootAdmin] = useState(false);

    useEffect(() => {
        const cookieData = Cookies.get('_auth_state');

        if (cookieData) {
            const rootAdmin = JSON.parse(cookieData);
            setisRootAdmin(rootAdmin.isRootAdmin);
            console.log(isRootAdmin);
        }

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
    }, []); // Empty dependency array ensures this effect runs only once on mount

    const handleDeleteAdmin = async (username) => {
        try {
            const adminRef = ref(db, 'Admin');
            const adminquery = query(adminRef, orderByChild('username'), equalTo(username));
            const snapshot = await get(adminquery);

            if (snapshot.exists()) {
                const adminData = Object.values(snapshot.val())[0];
                const adminKey = Object.keys(snapshot.val())[0];

                await remove(ref(db, `Admin/${adminKey}`));
            }
        } catch (error) {
            console.error('Error deleting admin:', error);
        }
    };

    return (
        <div>
            <AdminNavbar />
            <div className={styles.container}>
                <div className={styles.listcontainer}>
                    <h2 className={styles.listtitle}>UTMFleet Management Admin List</h2>
                    <table className={styles.listtable}>
                        <thead>
                            <tr>
                                <th className={styles.header}>No.</th>
                                <th className={styles.header}>Date of Creation</th>
                                <th className={styles.header}>Staff ID</th>
                                <th className={styles.header}>Full Name</th>
                                <th className={styles.header}>Username</th>
                                <th className={styles.header}>Email</th>
                                <th className={styles.header}>Phone</th>
                                {isRootAdmin && <th className={styles.header}></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {admins
                                .filter((admin) => !admin.isRootAdmin)
                                .filter((admin) => admin.role === 'admin')
                                .map((admin, index) => (
                                    <tr key={index} className={styles.listitem}>
                                        <td className={styles.data}>{index + 1}</td>
                                        <td className={styles.data}>
                                            <span className={styles.detaillabel}>{admin.dateOfCreation}</span> 
                                        </td>
                                        <td className={styles.data}>
                                            <span className={styles.detaillabel}>{admin.staffID}</span> 
                                        </td>
                                        <td className={styles.data}>
                                            <span className={styles.detaillabel}>{admin.fullname}</span> 
                                        </td>
                                        <td className={styles.data}>
                                            <span className={styles.detaillabel}>{admin.username}</span> 
                                        </td>
                                        <td className={styles.data}>
                                            <span className={styles.detaillabel}>{admin.email}</span>
                                        </td>
                                        <td className={styles.data}>
                                            <span className={styles.detaillabel}>{admin.phone}</span> 
                                        </td>
                                        {!admin.isRootAdmin && (
                                            <td className={styles.data}>
                                                <button
                                                    className={styles.deletebutton}
                                                    onClick={() => handleDeleteAdmin(admin.username)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {isRootAdmin && (
                        <div className={styles.addadminbuttoncontainer}>
                            <Link to={'/AddNewAdmin'}>
                                <button className={styles.addadminbutton}>Add Admin</button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminManage;
