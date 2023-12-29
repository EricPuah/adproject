import React, { useState, useEffect } from 'react';
import UserSideBar from './UserSideBar';
import { FaRegStar, FaStar } from "react-icons/fa";
import styles from './UserFeedback.module.css'; // Create a CSS module for styling
import { ref, onValue } from 'firebase/database';
import { db } from './../firebase.js';

function UserFeedback() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: '',
        message: '',
        rating: 0,
    });

    const [submitted, setSubmitted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ratingError, setRatingError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleStarHover = (star) => {
        setIsHovered(star);
    };

    const handleStarLeave = () => {
        setIsHovered(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent submission if already submitting
        if (isSubmitting) {
            return;
        }

        // Check if the rating is 0, and display an error message
        if (formData.rating === 0) {
            setRatingError('Please give a rating.');
            return;
        }

        try {
            // Reset rating error
            setRatingError('');

            // Set submitting status to true
            setIsSubmitting(true);

            // Make a POST request to your server endpoint
            const response = await fetch('https://ad-server-js.vercel.app/submit-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Feedback submitted:', formData);
                setSubmitted(true);
            } else {
                console.error('Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }

        finally {
            // Set submitting status back to false after submission
            setIsSubmitting(false);
        }
    };

    const [feedbackData, setFeedbackData] = useState([]);

    useEffect(() => {
        // Fetch feedback data from the server
        const feedbackRef = ref(db, 'feedback');

        onValue(feedbackRef, (snapshot) => {
            if (snapshot.exists()) {
                // Convert the snapshot value to an array of feedback
                const feedBackData = Object.values(snapshot.val());

                // Exclude the email property
                const filteredFeedbackData = feedBackData.map(({ dateOfCreation, name, category, message, rating }) => ({
                    dateOfCreation,
                    name,
                    category,
                    message,
                    rating,
                }));

                setFeedbackData(feedBackData);
            } else {
                console.error('No feedback found in Firebase');
            }
        });
    }, [db]);

    
    return (
        <div >
            <UserSideBar />
            <div className={styles.mainContentContainer}>
                <div className={styles.feedbackContainer}>
                    <div className={styles.feedbackContent}>
                        <h1 className={styles.h1}>User Feedback</h1>

                        {submitted ? (
                            <p className={styles.p}>Thank you for your feedback!</p>
                        ) : (
                            <form className={styles.form} onSubmit={handleSubmit}>

                                <div className={styles.ratingSection}>
                                    <label className={styles.label} htmlFor="rating">Overall Satisfaction:</label>
                                    <div className={styles.starContainer}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <label
                                                key={star}
                                                className={styles.starLabel}
                                                onMouseEnter={() => handleStarHover(star)}
                                                onMouseLeave={handleStarLeave}
                                            >
                                                <input
                                                    type="radio"
                                                    id={`star${star}`}
                                                    name="rating"
                                                    value={star}
                                                    checked={formData.rating === star}
                                                    onChange={handleChange}
                                                />
                                                {(isHovered && isHovered >= star) || (!isHovered && formData.rating >= star) ? <FaStar className={styles.stars} /> : <FaRegStar />}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label} htmlFor="name">Name:</label>
                                    <input className={styles.input}
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
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
                                    <label className={styles.label} htmlFor="category">Feedback Category:</label>
                                    <select
                                        className={styles.select}
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>Select a category</option>
                                        <option value="General">General Feedback</option>
                                        <option value="Bug">Bug Report</option>
                                        <option value="Feature">Feature Request</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label} htmlFor="message">Feedback Message:</label>
                                    <textarea
                                        className={styles.textarea}
                                        id="message"
                                        name="message"
                                        rows="4"
                                        cols="50"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button className={styles.button} type="submit">Submit Feedback</button>
                                {ratingError && <div className={styles.error}>{ratingError}</div>}
                            </form>
                        )}
                    </div>
                </div>
                <div className={styles.feedbackList}>
                    <h2 className={styles.listTitle}>Feedbacks</h2>
                    <table className={styles.listTable}>
                        <thead>
                            <tr>
                                <th className={styles.header}>No.</th>
                                <th className={styles.header}>Date of Creation</th>
                                <th className={styles.header}>Name</th>

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
                                        <span className={styles.detaillabel}>{feedback.dateOfCreation}</span>
                                    </td>
                                    <td className={styles.data}>
                                        <span className={styles.detaillabel}>{feedback.name}</span>
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
                <div className={styles.pageSpace}></div>
            </div>
        </div>
    );
}

export default UserFeedback;
