import React, { useState } from 'react';
import UserSideBar from './UserSideBar';
import { FaRegStar, FaStar } from "react-icons/fa";
import styles from './UserFeedback.module.css'; // Create a CSS module for styling

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

        try {
            // Make a POST request to your server endpoint
            const response = await fetch('http://localhost:8081/submit-feedback', {
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
    };

    return (
        <div>
            <UserSideBar />
            <div className={styles.feedbackContainer}>
                <div className={styles.feedbackContent}>
                    <h1>User Feedback</h1>

                    {submitted ? (
                        <p>Thank you for your feedback!</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            
                            <div className={styles.ratingSection}>
                                <label htmlFor="rating">Overall Satisfaction:</label>
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
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="category">Feedback Category:</label>
                                <select
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
                                <label htmlFor="message">Feedback Message:</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    cols="50"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button type="submit">Submit Feedback</button>

                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserFeedback;
