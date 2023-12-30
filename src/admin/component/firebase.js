import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { serverTimestamp, getDatabase, ref, push, set, query, orderByChild, equalTo, onValue, get, child, update } from 'firebase/database';
import { hash, compare } from 'bcryptjs'
import emailjs from 'emailjs-com';

const firebaseConfig = {
  apiKey: "AIzaSyAUv4mDaTr3XY5qnLT08hx8eECGtsP3beE",
  authDomain: "bus-teknologi-a772c.firebaseapp.com",
  databaseURL: "https://bus-teknologi-a772c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bus-teknologi-a772c",
  storageBucket: "bus-teknologi-a772c.appspot.com",
  messagingSenderId: "11058095143",
  appId: "1:11058095143:web:e49a26bf0aa1b5e84f9a02",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);


//RootRegister.js query (OLD)
const registerUserInFirebase = async (username, password) => {
  try {
    const usersRef = ref(db, 'Admin');
    const hashedPass = await hash(password, 10);
    const newUser = {
      username: username,
      password: hashedPass,
      isRootAdmin: false,
    };
    const newChildRef = push(usersRef);
    await set(newChildRef, newUser);
    return true; // Success
  } catch (error) {
    console.error('Firebase Error:', error);
    throw new Error('An error occurred: ' + error.message);
  }
}

const AddDriverInFirebase = async (fullname, username, email, phone, staffID, role, expiry) => {
  const length = 8;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let temporaryPassword = '';
  for (let i = 0; i < length; i++) {
    temporaryPassword += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  const hashedPass = await hash(temporaryPassword, 10);
  try {
    const usersRef = ref(db, 'Admin');
    const newUser = {
      fullname: fullname,
      username: username,
      password: hashedPass,
      isRootAdmin: false,
      email: email,
      phone: phone,
      staffID: staffID,
      role: role,
      expiry: expiry,
      dateOfCreation: new Date().toLocaleDateString('en-GB'),
    };
    const emailParams = {
      to_email: email,
      subject: 'BusTeknologi: Your New Account Details',
      message: `Hello ${fullname},\n\nYour account has been created successfully!\nUsername: ${username}\nTemporary Password: ${temporaryPassword}`,
    };
    await emailjs.send('service_26lac6k', 'template_2xd2bje', emailParams, 'PRJ-0y9h6INVAd4ZA');
    const newChildRef = push(usersRef);
    await set(newChildRef, newUser);
    return true; // Success
  } catch (error) {
    console.error('Firebase Error:', error);
    throw new Error('An error occurred: ' + error.message);
  }
}

const AddAdminInFirebase = async (fullname, username, email, phone, staffID, role) => {
  try {
    const length = 8;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let temporaryPassword = '';
    for (let i = 0; i < length; i++) {
      temporaryPassword += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const hashedPass = await hash(temporaryPassword, 10);
    const usersRef = ref(db, 'Admin');
    const newUser = {
      fullname: fullname,
      username: username,
      password: hashedPass,
      isRootAdmin: false,
      email: email,
      phone: phone,
      staffID: staffID,
      role: role,
      dateOfCreation: new Date().toLocaleDateString('en-GB'),
    };
    const emailParams = {
      to_email: email,
      subject: 'BusTeknologi: Your New Account Details',
      message: `Hello ${fullname},\n\nYour account has been created successfully!\nUsername: ${username}\nTemporary Password: ${temporaryPassword}`,
    };
    await emailjs.send('service_26lac6k', 'template_2xd2bje', emailParams, 'PRJ-0y9h6INVAd4ZA');
    const newChildRef = push(usersRef);
    await set(newChildRef, newUser);
    return true; // Success
  } catch (error) {
    console.error('Firebase Error:', error);
    throw new Error('An error occurred: ' + error.message);
  }
}

const checkRepeatedUser = async (username) => {
  try {
    const usersRef = ref(db, 'Admin');
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      // Check if the exact username exists
      return Object.values(userData).some((user) => user.username === username); // True if existed

    }
    return false; // No users in the database
  } catch (error) {
    console.error('Firebase Error:', error);
    throw new Error('An error occurred: ' + error.message);
  }
};

//Login.js authenticate user
const authenticateUser = async (user, password, setAuth, setSuccess, setErrMsg, errRef) => {
  try {
    const usersRef = ref(db, 'Admin');
    const userQuery = query(usersRef, orderByChild('username'), equalTo(user));
    const snapshot = await get(userQuery);

    if (snapshot.exists()) {
      const userDataValue = snapshot.val();

      let passwordMatched = false;

      for (const adminKey in userDataValue) {
        const adminData = userDataValue[adminKey];

        if (adminData.username === user && await compare(password, adminData.password)) {
          passwordMatched = true;
          console.log('Password matched');
          localStorage.setItem('adminData', JSON.stringify(adminData));
          setAuth({ user, password });
          break;
        }
      }
      if (!passwordMatched) {
        setSuccess(false);
        setErrMsg('Incorrect username or password');
        errRef.current.focus();
      } else {
        setSuccess(true);
      }
    } else {
      console.log('User not found');
      setErrMsg('User not found');
      errRef.current.focus();
    }

  } catch (err) {
    console.error('Firebase Error:', err);
    setErrMsg('An error occurred: ' + err.message);
    errRef.current.focus();
  }
}

//Admin Profile: Find User from Database and Return to page
const searchUserProfile = async (user) => {
  try {
    const userRef = ref(db, 'Admin');
    const userQuery = query(userRef, orderByChild('username'), equalTo(user));
    const snapshot = await get(userQuery);

    if (snapshot.exists()) {
      const userDataValue = snapshot.val();

      for (const adminKey in userDataValue) {
        const userdbData = userDataValue[adminKey];

        if (userdbData.username === user) {
          const adminData = {
            email: userdbData.email,
            phone: userdbData.phone,
            staffId: userdbData.staffID,
            username: userdbData.username,
            userKey: adminKey,
          }
          return adminData;
        }
      }
    } else {
      console.log('User not found');
      return null;
    }

  } catch (err) {
    console.error('Firebase Error:', err);
    throw err;
  }
}

const changePasswordInDB = async (userId, newPassword) => {
  try {
    const userRef = ref(db, `Admin/${userId}`);

    if (userRef) {
      const hashedPass = await hash(newPassword, 10);
      await update(userRef,
        {
          password: hashedPass
        });
      console.log('Password updated successfully');
      return true;
    } else {
      console.log('User not found');
      return false;
    }
  } catch (err) {
    console.error('Firebase Error:', err);
    throw err;
  }
};

const submitReportToFirebase = async (name, matricNumber, email, phone, busRoute, reportContents) => {
  try {
    const reportsRef = ref(db, 'reports');
    const newReport = {
      dateOfCreation: serverTimestamp(),
      name: name,
      matricNumber: matricNumber,
      email: email,
      phone: phone,
      busRoute: busRoute,
      reportContents: reportContents,
      status: 'new', // Set the default status to 'new'
      comments: []
    };
    const newChildRef = push(reportsRef);
    await set(newChildRef, newReport);
    return true; // Success
  } catch (error) {
    console.error('Firebase Error:', error);
    throw new Error('An error occurred: ' + error.message);
  }
};

const addCommentToReport = async (reportId, adminUsername, commentText) => {
  try {
    const commentsRef = ref(db, `reports/${reportId}/comments`); // Create a new "comments" node under the specific report
    const newComment = {
      date: serverTimestamp(),
      adminUsername,
      commentText,
    };
    const newChildRef = push(commentsRef);
    await set(newChildRef, newComment);
    return true; // Success
  } catch (error) {
    console.error('Firebase Error:', error);
    throw new Error('An error occurred: ' + error.message);
  }
};



export { auth, db, AddAdminInFirebase, AddDriverInFirebase, registerUserInFirebase, checkRepeatedUser, authenticateUser, searchUserProfile, changePasswordInDB, submitReportToFirebase, addCommentToReport };
