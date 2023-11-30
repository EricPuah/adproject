import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase'; // Import your Firebase database module
import { ref, get, update } from 'firebase/database';
import emailjs from 'emailjs-com';
import styles from './forgotpassword.module.css';

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
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
              setShowOtpInput(true);
              setCurrentStep('otp');
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

          const enteredOtpString = otp.join('');

          if (userEmail === email && userOtp === enteredOtpString) {
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

  const handleOtpInputChange = (e, index) => {
    const newOtp = otp.slice(); // Create a copy of the current OTP array
    newOtp[index] = e.target.value; // Update the value of the corresponding digit
    setOtp(newOtp); // Update the state with the new OTP array
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.h2}>Forgot Password</h2>
      <p className={styles.p}>
        {currentStep === 'email'
          ? 'Please enter your email to receive an OTP.'
          : 'Please enter the OTP sent to your email.'}
      </p>

      {currentStep === 'email' && (
        <>
          <label className={styles.label}>Email:</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <button className={styles.button} onClick={handleGenerateOtp}>
            {currentStep === 'otp' ? 'Resend OTP' : 'Send OTP'}
          </button>
        </>
      )}



      {message && <p>{message}</p>}

      {currentStep === 'otp' && (
        <>
          <label className={styles.label}>OTP:</label>

          <div className={styles.otpContainer}>
            {Array.from({ length: 6 }, (_, index) => (
              <input
                key={index}
                className={styles.otpInput}
                type="text"
                maxLength="1"
                value={otp[index] || ''} // Use value of the corresponding digit
                onChange={(e) => handleOtpInputChange(e, index)}
              />
            ))}
          </div>
          <br></br>
          <button className={styles.button} onClick={handleVerifyOtp}>
            Verify OTP
          </button>
          <br></br>
          <button className={styles.button} onClick={handleGenerateOtp}>
            {currentStep === 'otp' ? 'Resend OTP' : 'Send OTP'}
          </button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
