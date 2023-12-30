import React, { useState } from 'react'
import UserSideBar from './UserSideBar'
import style from './UserSideBar.module.css'; // Create a CSS module for styling
import styles from './UserMainPage.module.css';


function UserMainPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <div className={style.mainContentContainer}>
        <div className={styles.sidebar}>
          <UserSideBar />
        </div>
        <div className={styles.mainContentContainer}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
            <button className={styles.adminLoginButton}>
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserMainPage
