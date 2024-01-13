import React, { useState, useEffect } from 'react';
import styles from './AdminManageBusSchedule.module.css';
import AdminNavbar from './AdminNavbar';
import { storage, getPdfUrl } from './../firebase';
import { ref, uploadBytes } from 'firebase/storage';

function AdminManageBusSchedule() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [supportsObjectTag, setSupportsObjectTag] = useState(true);

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

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const url = await getPdfUrl();
        setPdfUrl(url);
      } catch (error) {
        console.error('Error fetching PDF URL:', error);
      }
    };

    // Check if the browser supports the <object> tag
    setSupportsObjectTag('content' in document.createElement('object'));

    fetchPdfUrl();
  }, []);

  return (
    <div>
      <AdminNavbar />
      <section className={styles.section}>
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
          <div className={styles.iframeContainer}>
            {pdfUrl && (
              <>
                {supportsObjectTag ? (
                  <object
                    data={pdfUrl}
                    type="application/pdf"
                    width="100%"
                    height="800px"
                  >
                    <p>It appears you don't have a PDF plugin for this browser. No biggie... you can <a href={pdfUrl}>click here to download the PDF file.</a></p>
                  </object>
                ) : (
                  <iframe
                    title="PDF Viewer"
                    src={pdfUrl}
                    width="100%"
                    height="500px"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminManageBusSchedule;
