import React, { useState, useEffect } from 'react';
import './AdminManage.css'; // Import the CSS file
import AdminNavbar from './AdminNavbar';
import { ref, onValue } from 'firebase/database';
import { db } from './../firebase';

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

    return (
        <div className="admin-manage-container">
            <AdminNavbar />
            <div className="admin-manage-list-container">
                <h2 className="admin-manage-list-title">Admins List</h2>
                <ul className="admin-manage-list">
                    {admins.map((admin, index) => (
                        <li key={index} className="admin-manage-list-item">
                            <span className="admin-manage-detail-label">Name:</span> {admin.username}, <span className="admin-manage-detail-label">Email:</span> {admin.email}, <span className="admin-manage-detail-label">Phone:</span> {admin.phone}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AdminManage;
