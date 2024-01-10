// Import the necessary dependencies
import React, { useState } from 'react';
import styles from './AdminManageBusSchedule.module.css';
import AdminNavbar from './AdminNavbar';
import { updatePdfFile } from './../firebase';

function AdminManageBusSchedule() {
  const [pdfFile, setPdfFile] = useState(null);

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  }

  const handleUpload = async () => {
    if (pdfFile) {
      try {
        // Call the function to update the PDF file in Firebase Storage
        await updatePdfFile(pdfFile);

        console.log('PDF file overwritten successfully!');

      } catch (error) {
        console.error('Error overwriting PDF file:', error.message);
      }
    } else {
      console.error('Please select a PDF file to upload.');
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className={styles.mainContentContainer}>
        <div className={styles.manageBusScheduleContainer}>
          <div className={styles.manageBusScheduleContent}>
            <h1 className={styles.h1}>Manage Bus Schedule</h1>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Upload New Bus Schedule:
                </label>
                <input className={styles.input} type="file" onChange={handleFileChange} />
              </div>
              <button className={styles.button} onClick={handleUpload}>Update PDF</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminManageBusSchedule;
