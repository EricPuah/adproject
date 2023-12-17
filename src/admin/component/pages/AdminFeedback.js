import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar'
import { FaRegStar, FaStar } from "react-icons/fa";
import styles from './AdminFeedback.module.css'; // Create a CSS module for styling

function AdminFeedback() {
    const [feedbackData, setFeedbackData] = useState([]);

    useEffect(() => {
        // Fetch feedback data from the server
        const fetchFeedbackData = async () => {
            try {
                const response = await fetch('http://localhost:8081/get-feedback');
                if (response.ok) {
                    const data = await response.json();
                    setFeedbackData(data);
                } else {
                    console.error('Failed to fetch feedback data');
                }
            } catch (error) {
                console.error('Error fetching feedback data:', error);
            }
        };

        fetchFeedbackData();
    }, []); // Empty dependency array ensures the effect runs once on mount

    return (
        <div>
            <AdminNavbar/>
            <h1>Admin Feedback</h1>
            {/* Display feedback data here */}
            <ul>
                {feedbackData.map((feedback) => (
                    <li key={feedback.id}>
                        <p>Name: {feedback.name}</p>
                        <p>Email: {feedback.email}</p>
                        <p>Category: {feedback.category}</p>
                        <p>Message: {feedback.message}</p>
                        <p>Rating: {feedback.rating}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminFeedback;

