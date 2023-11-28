import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from './firebase'; // Import your Firebase database module
import { ref, get, update } from 'firebase/database';
import styles from './resetpassword.module.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetStatus, setResetStatus] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the email and user code from the URL parameters
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');
  const code = searchParams.get('code');

  const handleResetPassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        setResetStatus('Passwords do not match. Please make sure both passwords are the same.');
        return;
      }

      const usersRef = ref(db, 'Admin');
      const usersSnapshot = await get(usersRef);
      const usersData = usersSnapshot.val();

      // Find the user with the provided email and code
      const userId = Object.keys(usersData).find(
        (key) => usersData[key].email === email && key === code
      );

      if (userId) {
        // Update the user's password in the database
        await update(ref(db, `Admin/${userId}`), {
          password: confirmPassword,
          otp: null
        });

        setResetStatus('Password reset successfully. You can now log in with your new password.');

        navigate('/login');
      }
      else {
        setResetStatus('Invalid or expired verification information. Please try again.');
      }
    } catch (error) {
      console.log("3rd");
      setResetStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.h2}>Reset Password</h2>
      <p className={styles.p}>Enter your new password:</p>

      <input
        className={styles.input}
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter your new password"
      />

      <input
        className={styles.input}
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm your new password"
      />

      <button className={styles.button} onClick={handleResetPassword}>
        Reset Password
      </button>

      {resetStatus && <p>{resetStatus}</p>}
    </div>
  );
};

export default ResetPassword;
