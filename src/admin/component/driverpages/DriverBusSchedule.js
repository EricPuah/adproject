import React, { useState, useEffect } from 'react';
import AdminNavbar from '../pages/AdminNavbar';
import style from '../pages/AdminNavBar.module.css';
import styles from './DriverBusSchedule.module.css';
import { getPdfUrl } from '../firebase';

function DriverBusSchedule() {
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
            <AdminNavbar />
            <div className={styles.mainContentContainer}>
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

export default DriverBusSchedule;
