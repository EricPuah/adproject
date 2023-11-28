import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase'; // Import your Firebase database module
import { ref, get, update } from 'firebase/database';
import emailjs from 'emailjs-com';
import styles from './forgotpassword.module.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState(null);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const navigate = useNavigate();

  const handleGenerateOtp = async () => {
    try {
      const usersRef = ref(db, 'Admin');
      const usersSnapshot = await get(usersRef);
      const usersData = usersSnapshot.val();

      if (usersData) {
        for (const code in usersData) {
          const userEmail = usersData[code].email;

          if (userEmail === email) {
            const generatedOtp = generateOtp();
            const userPath = `Admin/${code}`;

            try {
              await update(ref(db, userPath), { otp: generatedOtp });
              sendOtpEmail(email, generatedOtp);
              setMessage('OTP sent. Check your email.');
              setShowOtpInput(true); // Show OTP input field after sending OTP
            } catch (updateError) {
              setMessage(`Error updating OTP: ${updateError.message}`);
            }
            return;
          }
        }
      }

      setMessage('Invalid Email');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const usersRef = ref(db, 'Admin');
      const usersSnapshot = await get(usersRef);
      const usersData = usersSnapshot.val();

      if (usersData) {
        for (const code in usersData) {
          const userEmail = usersData[code].email;
          const userOtp = usersData[code].otp;

          if (userEmail === email && userOtp === otp) {
            navigate(`/resetpassword?email=${email}&code=${code}`);
            return;
          }
        }
      }

      setMessage('Invalid OTP');
    } catch (error) {

      setMessage(`Error: ${error.message}`);
    }
  };

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOtpEmail = (userEmail, generatedOtp) => {
    const templateParams = {
      to_email: userEmail,
      otp: generatedOtp,
    };

    emailjs
      .send(
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
    <div className={styles.container}>
      <h2 className={styles.h2}>Forgot Password</h2>
      <p className={styles.p}>Please enter your email to receive an OTP.</p>

      <label className={styles.label}>Email:</label>
      <input
        className={styles.input}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />

      <button className={styles.button} onClick={handleGenerateOtp}>
        {showOtpInput ? 'Resend OTP' : 'Send OTP'}
      </button>

      {message && <p>{message}</p>}

      {showOtpInput && (
        <>
          <label className={styles.label}>OTP:</label>
          <input
            className={styles.input}
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <button className={styles.button} onClick={handleVerifyOtp}>
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
