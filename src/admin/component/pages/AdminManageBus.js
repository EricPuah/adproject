import React, { useState, useEffect } from 'react';
import styles from './AdminManageBus.module.css';
import style from './AdminNavBar.module.css';
import AdminNavbar from './AdminNavbar';
import { ref, onValue, query, orderByChild, equalTo, get, remove } from 'firebase/database';
import { db } from './../firebase';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Modal from 'react-modal'

function AdminManage() {
    const [admins, setAdmins] = useState([]);
    const [isRootAdmin, setisRootAdmin] = useState(false);
    const [role, setRole] = useState(false);
    const [deleteConfirmationModalIsOpen, setDeleteConfirmationModalIsOpen] = useState(false);
    const [selectedBusDriverusername, setselectedBusDriverusername] = useState('');

    useEffect(() => {
        const cookieData = Cookies.get('_auth_state');

        if (cookieData) {
            const rootAdmin = JSON.parse(cookieData);
            setisRootAdmin(rootAdmin.isRootAdmin);
            setRole(rootAdmin.role);
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
            setselectedBusDriverusername(username);
            setDeleteConfirmationModalIsOpen(true);
        } catch (error) {
            console.error('Error deleting admin:', error);
        }
    };

    const confirmDeleteBusDriver = async () => {
        try {
            const busDriverRef = ref(db, 'Admin');
            const busDriverQuery = query(busDriverRef, orderByChild('username'), equalTo(selectedBusDriverusername));
            const snapshot = await get(busDriverQuery);

            if (snapshot.exists()) {
                const busDriverKey = Object.keys(snapshot.val())[0];

                await remove(ref(db, `Admin/${busDriverKey}`));
                setDeleteConfirmationModalIsOpen(false);
            }
        } catch (error) {
            console.error ('Error deleting bus driver: ', error);
        }
    }

    return (
        <div>
            <AdminNavbar />
            <div className={style.mainContentContainer}>
                <div className={styles.container}>
                    <div className={styles.listcontainer}>
                        <h2 className={styles.listtitle}>UTMFleet Bus Driver List</h2>
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
                                    <th className={styles.header}>License Expiry</th>
                                    {isRootAdmin && <th className={styles.header}></th>}
                                </tr>
                            </thead>
                            <tbody>
                                {admins
                                    .filter((admin) => !admin.isRootAdmin)
                                    .filter((admin) => admin.role === 'driver')
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
                                            <td className={styles.data}>
                                                <span className={styles.detaillabel}>{admin.expiry}</span>
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
                        {role === 'admin' && (
                            <div className={styles.addadminbuttoncontainer}>
                                <Link to={'/AddNewBusDriver'}>
                                    <button className={styles.addadminbutton}>Add Bus Driver</button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                isOpen={deleteConfirmationModalIsOpen}
                onRequestClose={() => setDeleteConfirmationModalIsOpen(false)}
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
                <div className={styles.modalContent}>
                    <h2 className={styles.h2delete}>Confirm Deletion</h2>
                    <p>Are you sure you want to delete this admin?</p>
                    <div className={styles.modalButtons}>
                        <button className={styles.nobutton} onClick={() => setDeleteConfirmationModalIsOpen(false)}>No</button>
                        <button className={styles.yesbutton} onClick={confirmDeleteBusDriver}>Yes</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default AdminManage;
