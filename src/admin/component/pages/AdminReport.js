// AdminReport.js
import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import { ref, onValue, update } from 'firebase/database';
import { db, addCommentToReport } from './../firebase'; // Import the addCommentToReport function
import styles from './AdminReport.module.css'; // Create a CSS module for styling

function AdminReport() {
    const [reportData, setReportData] = useState([]);
    const [selectedReportId, setSelectedReportId] = useState('');

    useEffect(() => {
        // Fetch report data from the server
        const reportsRef = ref(db, 'reports');

        onValue(reportsRef, (snapshot) => {
            if (snapshot.exists()) {
                const reportData = Object.entries(snapshot.val()).map(([reportId, report]) => ({
                    id: reportId,
                    ...report
                }));
                setReportData(reportData);
            } else {
                console.error('No reports found in Firebase');
            }
        });
    }, []);

    const handleUpdateStatus = async (reportId, newStatus) => {
        // Update the status in Firebase
        const reportRef = ref(db, `reports/${reportId}`);
        await update(reportRef, { status: newStatus });
    };

    const handleAddComment = async (reportId, adminUsername, commentText) => {
        // Add a comment to the report in Firebase
        await addCommentToReport(reportId, adminUsername, commentText);
    };

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
                                    <th className={styles.header}>Status</th>
                                    <th className={styles.header}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((report, index) => (
                                    <tr key={report.id} className={styles.listitem}>
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
                                        <td className={styles.data}>
                                            <span className={styles.detaillabel}>{report.status}</span>
                                        </td>
                                        <td className={styles.data}>
                                            {report.status === 'new' && (
                                                <>
                                                    <button onClick={() => handleUpdateStatus(report.id, 'in progress')}>Mark In Progress</button>
                                                    <button onClick={() => handleAddComment(report.id, 'AdminUser1', 'Initial comment')}>Add Comment</button>
                                                </>
                                            )}
                                            {report.status === 'in progress' && (
                                                <>
                                                    <button onClick={() => handleUpdateStatus(report.id, 'solved')}>Mark Solved</button>
                                                    <button onClick={() => handleAddComment(report.id, 'AdminUser1', 'Follow-up comment')}>Add Comment</button>
                                                </>
                                            )}
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
