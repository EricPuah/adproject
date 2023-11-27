import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, push, set, query, orderByChild, equalTo, onValue, get, child } from 'firebase/database';
import { hash, compare } from 'bcryptjs'

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

const AddDriverInFirebase = async (username, email, phone, staffID, role, expiry) => {
  const length = 8;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let temporaryPassword = 'Abc@1234';
  // for (let i = 0; i < length; i++) {
  //   temporaryPassword += characters.charAt(Math.floor(Math.random() * characters.length));
  // }
  const hashedPass = await hash(temporaryPassword, 10);
  try {
    const usersRef = ref(db, 'Admin');
    const newUser = {
      username: username,
      password: hashedPass,
      isRootAdmin: false,
      email: email,
      phone: phone,
      staffID: staffID,
      role: role,
      expiry: expiry,
    };
    const newChildRef = push(usersRef);
    await set(newChildRef, newUser);
    return true; // Success
  } catch (error) {
    console.error('Firebase Error:', error);
    throw new Error('An error occurred: ' + error.message);
  }
}

const AddAdminInFirebase = async (username, email, phone, staffID, role) => {
  try {
    const length = 8;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let temporaryPassword = 'Abc@1234';
    // for (let i = 0; i < length; i++) {
    //   temporaryPassword += characters.charAt(Math.floor(Math.random() * characters.length));
    // }
    const hashedPass = await hash(temporaryPassword, 10);
    const usersRef = ref(db, 'Admin');
    const newUser = {
      username: username,
      password: hashedPass,
      isRootAdmin: false,
      email: email,
      phone: phone,
      staffID: staffID,
      role: role,
    };
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

export { auth, db, AddAdminInFirebase, AddDriverInFirebase, registerUserInFirebase, checkRepeatedUser, authenticateUser };
