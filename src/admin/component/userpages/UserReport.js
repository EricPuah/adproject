// UserReport.js
import React, { useState } from 'react';
import UserSideBar from './UserSideBar';
import style from '../../global.module.css';
import styles from './UserReport.module.css'; // Create a CSS module for styling
import { submitReportToFirebase } from './../firebase.js';
import { serverTimestamp } from 'firebase/database';

function UserReport() {
    console.log('UserReport component rendering...');
    const [formData, setFormData] = useState({
        name: '',
        matricNumber: '',
        email: '',
        phone: '',
        busRoute: '',
        reportContents: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedBusRoute, setSelectedBusRoute] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent submission if already submitting
        if (isSubmitting) {
            return;
        }

        try {
            // Set submitting status to true
            setIsSubmitting(true);

            // Make a function call to submit the report
            const success = await submitReportToFirebase(
                formData.name,
                formData.matricNumber,
                formData.email,
                formData.phone,
                selectedBusRoute,
                formData.reportContents,
            );

            if (success) {
                console.log('Report submitted:', formData);
                setSubmitted(true);
            } else {
                console.error('Failed to submit report');
            }
        } catch (error) {
            console.error('Error submitting report:', error);
        } finally {
            // Set submitting status back to false after submission
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <UserSideBar />
            <div className={style.mainContentContainer}>
                <div className={styles.reportContainer}>
                    <div className={styles.reportContent}>
                        <h1 className={styles.h1}>User Report</h1>

                        {submitted ? (
                            <p className={styles.p}>Thank you for your report!</p>
                        ) : (
                            <form className={styles.form} onSubmit={handleSubmit}>

                                <div className={styles.formGroup}>
                                    <label className={styles.label} htmlFor="name">Name:</label>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label} htmlFor="matricNumber">Matric Number:</label>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        id="matricNumber"
                                        name="matricNumber"
                                        value={formData.matricNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label} htmlFor="email">Email:</label>
                                    <input
                                        className={styles.input}
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label} htmlFor="phone">Phone:</label>
                                    <input
                                        className={styles.input}
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label} htmlFor="busRoute">Bus Route:</label>
                                    <select
                                        className={styles.select}
                                        id="busRoute"
                                        name="busRoute"
                                        value={selectedBusRoute}
                                        onChange={(e) => setSelectedBusRoute(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Select a route</option>
                                        <option value="A">Route A</option>
                                        <option value="B">Route B</option>
                                        <option value="C">Route C</option>
                                        <option value="D">Route D</option>
                                        <option value="E">Route E</option>
                                        <option value="F">Route F</option>
                                        <option value="G">Route G</option>
                                        <option value="H">Route H</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label} htmlFor="reportContents">Report Contents:</label>
                                    <textarea
                                        className={styles.textarea}
                                        id="reportContents"
                                        name="reportContents"
                                        rows="4"
                                        cols="50"
                                        value={formData.reportContents}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button className={styles.button} type="submit">Submit Report</button>
                            </form>
                        )}
                    </div>
                </div>
                <div className={styles.pageSpace}></div>
            </div>
        </div>
    );
}

export default UserReport;
