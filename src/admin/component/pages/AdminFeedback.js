import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import style from './AdminNavBar.module.css';
import styles from './AdminFeedback.module.css';
import { ref, onValue } from 'firebase/database';
import { db } from './../firebase';

function AdminFeedback() {
    const [feedbackData, setFeedbackData] = useState([]);

    useEffect(() => {
        const feedbackRef = ref(db, 'feedback');

        onValue(feedbackRef, (snapshot) => {
            if (snapshot.exists()) {
                const feedBackData = Object.values(snapshot.val());
                setFeedbackData(feedBackData);
            } else {
                console.error('No feedback found in Firebase');
            }
        });
    }, []);

    console.log('feedbackData:', feedbackData);

    return (
        <div>
            <AdminNavbar />
                <div className={style.mainContentContainer}>
                    <div className={styles.container}>
                        <div className={styles.listcontainer}>
                            <h2 className={styles.listtitle}>User Feedback</h2>

                            <table className={styles.listtable}>
                                <thead>
                                    <tr>
                                        <th className={styles.header}>No.</th>
                                        <th className={styles.header}>Date of Creation</th>
                                        <th className={styles.header}>Name</th>
                                        <th className={styles.header}>Email</th>
                                        <th className={styles.header}>Category</th>
                                        <th className={styles.header}>Message</th>
                                        <th className={styles.header}>Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feedbackData.map((feedback, index) => (
                                        <tr key={index} className={styles.listitem}>
                                            <td className={styles.data}>{index + 1}</td>
                                            <td className={styles.data}>
                                                <span className={styles.detaillabel}>{feedback.timestamp}</span>
                                            </td>
                                            <td className={styles.data}>
                                                <span className={styles.detaillabel}>{feedback.name}</span>
                                            </td>
                                            <td className={styles.data}>
                                                <span className={styles.detaillabel}>{feedback.email}</span>
                                            </td>
                                            <td className={styles.data}>
                                                <span className={styles.detaillabel}>{feedback.category}</span>
                                            </td>
                                            <td className={`${styles.data} ${styles.messageColumn}`}>
                                                <span className={styles.detaillabel}>{feedback.message}</span>
                                            </td>
                                            <td className={styles.data}>
                                                <span className={styles.detaillabel}>{feedback.rating}</span>
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

export default AdminFeedback;
