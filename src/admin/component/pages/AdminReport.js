// AdminReport.js
import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import { ref, onValue } from 'firebase/database';
import { db } from './../firebase';
import styles from './AdminReport.module.css'; // Create a CSS module for styling

function AdminReport() {
    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        // Fetch report data from the server
        const reportsRef = ref(db, 'reports');

        onValue(reportsRef, (snapshot) => {
            if (snapshot.exists()) {
                // Convert the snapshot value to an array of reports
                const reportData = Object.values(snapshot.val());
                setReportData(reportData);
            } else {
                console.error('No reports found in Firebase');
            }
        });
    }, []); // Empty dependency array ensures the effect runs once on mount

    return (
        <div>
            <AdminNavbar />
            <div className={styles.mainContentContainer}>
                <div className={styles.container}>
                    <div className={styles.listcontainer}>
                        <h2 className={styles.listtitle}>User Reports</h2>
                        <table className={styles.listtable}>
                            <thead>
                                <tr>
                                    <th className={styles.header}>No.</th>
                                    <th className={styles.header}>Date of Creation</th>
                                    <th className={styles.header}>Name</th>
                                    <th className={styles.header}>Matric Number</th>
                                    <th className={styles.header}>Email</th>
                                    <th className={styles.header}>Phone</th>
                                    <th className={styles.header}>Bus Route</th>
                                    <th className={styles.header}>Report Contents</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((report, index) => (
                                    <tr key={index} className={styles.listitem}>
                                        <td className={styles.data}>{index + 1}</td>
                                        <td className={styles.data}>
                                            <span className={styles.detaillabel}>{report.dateOfCreation}</span>
                                        </td>
                                        <td className={styles.data}>
                                            <span className={styles.detaillabel}>{report.name}</span>
                                        </td>
                                        <td className={styles.data}>
                                            <span className={styles.detaillabel}>{report.matricNumber}</span>
                                        </td>
                                        <td className={styles.data}>
                                            <span className={styles.detaillabel}>{report.email}</span>
                                        </td>
                                        <td className={styles.data}>
                                            <span className={styles.detaillabel}>{report.phone}</span>
                                        </td>
                                        <td className={styles.data}>
                                            <span className={styles.detaillabel}>{report.busRoute}</span>
                                        </td>
                                        <td className={`${styles.data} ${styles.messageColumn}`}>
                                            <span className={styles.detaillabel}>{report.reportContents}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminReport;
