import React, { useState, useEffect } from 'react';
import UserSideBar from './UserSideBar';
import { FaRegStar, FaStar } from "react-icons/fa";
import style from './UserSideBar.module.css'; // Create a CSS module for styling
import styles from './UserBusSchedule.module.css'; // Create a CSS module for styling
import { ref, onValue } from 'firebase/database';
import { getPdfUrl } from '../firebase';

function UserBusSchedule() {

    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        const fetchPdfUrl = async () => {
            try {
                const url = await getPdfUrl();
                setPdfUrl(url);
            } catch (error) {
                console.error('Error fetching PDF URL:', error);
            }
        };

        fetchPdfUrl();
    }, []);
    return (
        <div >
            <UserSideBar />
            <div className={style.mainContentContainer}>
                <div className={styles.busScheduleContainer}>
                    <div className={styles.busScheduleContent}>
                        <h1 className={styles.h1}>Bus Schedule</h1>
                        <div className={styles.iframeContainer}>
                            {pdfUrl && (
                                <object title="PDF Viewer" data={pdfUrl} type='application/pdf' width="100%" height="800px" />
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles.pageSpace}></div>
            </div>
        </div>
    );
}

export default UserBusSchedule;
