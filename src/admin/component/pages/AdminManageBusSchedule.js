import React, { useState } from 'react';
import styles from './AdminManageBusSchedule.module.css';
import AdminNavbar from './AdminNavbar';
import { storage } from './../firebase';
import { ref, uploadBytes } from 'firebase/storage';

function AdminManageBusSchedule() {
  const [pdfFile, setPdfFile] = useState(null);

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  }

  const handleUpload = async (newPdfFile) => {
    console.log('Updating PDF file...');
    console.log('newPdfFile:', newPdfFile);

    try {
      console.log("New File");
      const pdfRef = ref(storage, 'new/bus_schedule.pdf');
      console.log(pdfRef.fullPath);
      const snapshot = await uploadBytes(pdfRef, newPdfFile);
      console.log('File has been overwritten successfully!', snapshot);
      return snapshot;
    } catch (uploadError) {
      console.error('Error overwriting file:', uploadError.code, uploadError.message);
      throw uploadError;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (pdfFile) {
      try {
        await handleUpload(pdfFile);
        console.log('PDF file uploaded successfully!');
        // Additional logic if needed
      } catch (error) {
        console.error('Error uploading PDF file:', error.message);
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
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Upload New Bus Schedule:
                </label>
                <input className={styles.input} type="file" onChange={handleFileChange} />
              </div>
              <button className={styles.button} type="submit">Update PDF</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminManageBusSchedule;
