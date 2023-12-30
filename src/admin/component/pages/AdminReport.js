// AdminReport.js
import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import style from './AdminNavBar.module.css';
import { ref, onValue, update, get } from 'firebase/database';
import { db, addCommentToReport } from './../firebase';
import style from './AdminNavBar.module.css';
import styles from './AdminReport.module.css';

function AdminReport() {
    const [reportData, setReportData] = useState([]);
    const [selectedReportId, setSelectedReportId] = useState('');
    const [commentText, setCommentText] = useState('');
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [expandedReportId, setExpandedReportId] = useState(null);

    useEffect(() => {
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
        const reportRef = ref(db, `reports/${reportId}`);
        await update(reportRef, { status: newStatus });
    };

    const handleAddComment = async (reportId, adminUsername, commentText) => {
        try {
            await handleUpdateStatus(reportId, 'in progress');
            await addCommentToReport(reportId, adminUsername, commentText);

            const updatedReportData = await fetchUpdatedReportData();
            setReportData(updatedReportData);

            setCommentText('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const fetchUpdatedReportData = async () => {
        try {
            const reportsRef = ref(db, 'reports');
            const snapshot = await get(reportsRef);

            if (snapshot.exists()) {
                const reportData = Object.entries(snapshot.val()).map(([reportId, report]) => ({
                    id: reportId,
                    ...report
                }));
                return reportData;
            } else {
                console.error('No reports found in Firebase');
                return [];
            }
        } catch (error) {
            console.error('Firebase Error:', error);
            throw new Error('An error occurred: ' + error.message);
        }
    };

    const renderCommentInput = (report) => {
        const isCommentInputActive = showCommentInput && selectedReportId === report.id;

        if (isCommentInputActive) {
            return (
                <div>
                    <textarea
                        placeholder="Enter your comment"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    {commentText.trim() !== '' ? (
                        <button
                            onClick={() => {
                                handleAddComment(report.id, 'AdminUser1', commentText);
                                setShowCommentInput(false);
                                setCommentText('');
                            }}
                        >
                            Submit Comment
                        </button>
                    ) : (
                        <button onClick={() => setShowCommentInput(false)}>Cancel</button>
                    )}
                </div>
            );
        } else if (report.status === 'new' || report.status === 'in progress') {
            return (
                <button
                    onClick={() => {
                        setSelectedReportId(report.id);
                        setShowCommentInput(true);
                    }}
                >
                    Add Comment
                </button>
            );
        } else {
            return null; // Return null for other cases
        }
    };


    return (
        <div>
            <AdminNavbar />
            <div className={style.mainContentContainer}>
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
                                    <React.Fragment key={report.id}>
                                        {/* Main row for report details */}
                                        <tr className={styles.listitem}>
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
                                            <td className={`${styles.data} ${styles.messageColumn}`} style={{ whiteSpace: 'pre-line' }}>
                                                <span className={styles.detaillabel}>{report.reportContents}</span>
                                            </td>
                                            <td className={styles.data}>
                                                <span className={styles.detaillabel}>{report.status}</span>
                                            </td>
                                            <td className={styles.data}>
                                                {renderCommentInput(report)}
                                                {report.status === 'in progress' && (
                                                    <>
                                                        <button onClick={() => handleUpdateStatus(report.id, 'solved')}>Mark Solved</button>

                                                        {/* Include the button for expanding comments */}
                                                        {report.status !== 'new' && (
                                                            <button
                                                                onClick={() => {
                                                                    setExpandedReportId((prevId) => (prevId === report.id ? null : report.id));
                                                                }}
                                                            >
                                                                {expandedReportId === report.id ? 'Hide Comments' : 'View Comments'}
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                        </tr>

                                        {/* Comments row (displayed conditionally based on expandedReportId) */}
                                        {expandedReportId === report.id && (
                                            <tr className={styles.commentRow}>
                                                <td colSpan="10" className={styles.commentCell}>
                                                    {report.comments &&
                                                        Object.values(report.comments).map((comment, commentIndex) => (
                                                            <div key={commentIndex} className={styles.comment}>
                                                                <span>{comment.adminUsername}:</span>
                                                                <p>{comment.commentText}</p>
                                                                <p>{new Date(comment.date).toLocaleString()}</p>
                                                            </div>
                                                        ))}
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
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
