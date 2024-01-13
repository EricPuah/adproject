import React, { useState, useEffect } from 'react';
import UserSideBar from './UserSideBar';
import style from './UserSideBar.module.css';
import styles from './UserBusSchedule.module.css';
import { getPdfUrl } from '../firebase';

function UserBusSchedule() {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [supportsObjectTag, setSupportsObjectTag] = useState(true);

    useEffect(() => {
        const fetchPdfUrl = async () => {
            try {
                const url = await getPdfUrl();
                setPdfUrl(url);
            } catch (error) {
                console.error('Error fetching PDF URL:', error);
            }
        };

        // Check if the browser supports the <object> tag
        setSupportsObjectTag('content' in document.createElement('object'));

        fetchPdfUrl();
    }, []);

    return (
        <div>
            <UserSideBar />
            <div className={style.mainContentContainer}>
                <div className={styles.busScheduleContainer}>
                    <div className={styles.busScheduleContent}>
                        <h1 className={styles.h1}>Bus Schedule</h1>
                        <div className={styles.iframeContainer}>
                            {pdfUrl && (
                                <>
                                    {supportsObjectTag ? (
                                        <object
                                            data={pdfUrl}
                                            type="application/pdf"
                                            width="100%"
                                            height="800px"
                                        >
                                            <p>It appears you don't have a PDF plugin for this browser. No biggie... you can <a href={pdfUrl}>click here to download the PDF file.</a></p>
                                        </object>
                                    ) : (
                                        <iframe
                                            title="PDF Viewer"
                                            src={pdfUrl}
                                            width="100%"
                                            height="800px"
                                        />
                                    )}
                                </>
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
