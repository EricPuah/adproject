import React, { useState } from 'react';
import { db } from './firebase'; // Import your Firebase database module
import { getDatabase, ref, get, update } from 'firebase/database';
import emailjs from 'emailjs-com';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);

  const handleResetPassword = async () => {
    try {
      const usersRef = ref(db, 'Admin');
      const usersSnapshot = await get(usersRef);
      const usersData = usersSnapshot.val();
  
      if (usersData) {
        for (const code in usersData) {
          const userEmail = usersData[code].email;
  
          if (userEmail === email) {
            const temporaryPassword = generateTemporaryPassword();
            const userPath = `Admin/${code}`;
  
            try {
              await update(ref(db, userPath), { password: temporaryPassword });
              sendTemporaryPasswordEmail(email, temporaryPassword);
              setMessage('Temporary password sent. Please check your email.');
            } catch (updateError) {
              setMessage(`Error updating password: ${updateError.message}`);
            }
            return; // Exit loop once user is found
          }
        }
      }
  
      setMessage('Email not found in the database.');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const generateTemporaryPassword = () => {
    const length = 8;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let temporaryPassword = '';
    for (let i = 0; i < length; i++) {
      temporaryPassword += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return temporaryPassword;
  };

  const sendTemporaryPasswordEmail = (userEmail, temporaryPassword) => {
    const templateParams = {
      to_email: userEmail,
      temp_password: temporaryPassword,
    };
  
    emailjs.send(
      'service_6b9zw5a', // replace with your Email.js service ID
      'template_0zrp5zg', // replace with your Email.js template ID
      templateParams,
      'BkYPmogqsG5jl45iH'
    )
      .then((response) => {
        console.log('Email sent successfully:', response);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <p>Please enter your email to receive a temporary password.</p>

      <label>Email:</label>
      <input
        type="email" // Use type="email" for email input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />

      <button onClick={handleResetPassword}>Reset Password</button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
