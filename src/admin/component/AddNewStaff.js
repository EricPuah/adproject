import { useRef, useState, useEffect } from 'react';
import { faCheck, faTimes, faInfoCircle, faFontAwesome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './RootRegister.module.css';
import { AddDriverInFirebase, AddAdminInFirebase, checkRepeatedUser } from "./firebase";
import AdminNavbar from './pages/AdminNavbar';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\d+$/;
const STAFFID_REGEX = /^[a-zA-Z0-9]+$/;

const AddNewStaff = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);AddDriverInFirebase
    const [userFocus, setUserFocus] = useState(false);
    const [usernameExists, setUsernameExists] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [phone, setPhone] = useState('');
    const [validPhone, setValidPhone] = useState(false);
    const [phoneFocus, setPhoneFocus] = useState(false);

    const [StaffID, setStaffID] = useState('');
    const [validStaffID, setValidStaffID] = useState(false);
    const [staffIDFocus, setStaffIDFocus] = useState(false);

    const [role, setRole] = useState('');

    const [DriverExpiry, setDriverExpiry] = useState('');
    const [DriverExpiryFocus, setDriverExpiryFocus] = useState(false);


    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);


    useEffect(() => {
        userRef.current.focus();
    }, []);

    //Validate username validty
    useEffect(() => {
        const checkUserAvailability = async () => {
            const result = USER_REGEX.test(user);
            setValidName(result);

            if (user && result) {
                try {
                    const isUsernameAvailable = await checkRepeatedUser(user);
                    setUsernameExists(isUsernameAvailable);
                } catch (error) {
                    console.error('Error checking username availability:', error);
                }
            }
        };
        checkUserAvailability();
    }, [user]);

    //Validate Email Validity
    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email]);

    useEffect(() => {
        const result = PHONE_REGEX.test(phone);
        setValidPhone(result);
    }, [phone]);

    useEffect(() => {
        const result = STAFFID_REGEX.test(StaffID);
        setValidStaffID(result);
    }, [StaffID]);

    //Set Error Message
    useEffect(() => {
        setErrMsg('');
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validName) {
            setErrMsg('Please fill out the form correctly.');
            return;
        }

        try {
            if(role === 'driver') {
                await AddDriverInFirebase(user, email, phone, StaffID, role, DriverExpiry); //Register user into DB
            } else {
                await AddAdminInFirebase(user, email, phone, StaffID, role); //Register user into DB
            }
            setSuccess(true);
        } catch (error) {
            console.error('Firebase Error:', error);
            setErrMsg('An error occurred: ' + error.message);
        }
    }

    return (
        <div>
            <AdminNavbar />

            {success ? (
                <section className={styles.section}>
                    <h1>{user} signed up successfully!</h1>
                </section>
            ) : (
                <section className={styles.section}>
                    {/* Register Form */}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <p ref={errRef} className={errMsg ? `${styles.errmsg}` : `${styles.offscreen}`} aria-live="assertive">
                            {errMsg}
                        </p>
                        <h1>Add New Admin</h1>
                        {/* Username Field & Validation Output */}
                        <label htmlFor="username" className={styles.label}>
                            Username:
                            {user && (
                                <>
                                    <span className={(validName && !usernameExists) ? styles.hide : styles.invalid}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </span>
                                    <span className={validName && !usernameExists ? styles.valid : styles.hide}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                </>
                            )}
                        </label>
                        <input className={styles.input}
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete='off'
                            onChange={(e) => setUser(e.target.value)}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby='uidnote'
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        ></input>
                        <p id='uidnote' className={userFocus && user && !validName ? `${styles.instructions}` : `${styles.offscreen}`}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters. <br />
                            Must begin with a letter. <br />
                            Letters, numbers, underscores, hyphens allowed. <br />
                        </p>
                        <p id='uidnote' className={(user && usernameExists) ? `${styles.instructions}` : `${styles.offscreen}`}>
                            <FontAwesomeIcon icon={faTimes} className={styles.invalid} />
                            The username has already been taken.
                        </p>

                        <label htmlFor="username" className={styles.label}>
                            Email:
                            {email && (
                                <>
                                    <span className={(validEmail) ? styles.hide : styles.invalid}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </span>
                                    <span className={validEmail ? styles.valid : styles.hide}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                </>
                            )}
                        </label>
                        <input className={styles.input}
                            type="email"
                            id="email"
                            autoComplete='off'
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby='uidnote'
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        ></input>
                        <p id='uidnote' className={emailFocus && email && !validEmail ? `${styles.instructions}` : `${styles.offscreen}`}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Please enter a valid email.
                        </p>

                        <label htmlFor="username" className={styles.label}>
                            Phone Number:
                            {phone && (
                                <>
                                    <span className={(validPhone) ? styles.hide : styles.invalid}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </span>
                                    <span className={validPhone ? styles.valid : styles.hide}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                </>
                            )}
                        </label>
                        <input className={styles.input}
                            type="tel"
                            id="phone"
                            autoComplete='off'
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            aria-invalid={validPhone ? "false" : "true"}
                            aria-describedby='uidnote'
                            onFocus={() => setPhoneFocus(true)}
                            onBlur={() => setPhoneFocus(false)}
                        ></input>
                        <p id='uidnote' className={phoneFocus && phone && !validPhone ? `${styles.instructions}` : `${styles.offscreen}`}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Please enter a valid phone number.
                        </p>

                        <label htmlFor="username" className={styles.label}>
                            UTM StaffID:
                            {StaffID && (
                                <>
                                    <span className={(validStaffID) ? styles.hide : styles.invalid}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </span>
                                    <span className={validStaffID ? styles.valid : styles.hide}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                </>
                            )}
                        </label>
                        <input className={styles.input}
                            type="text"
                            id="staffID"
                            autoComplete='off'
                            onChange={(e) => setStaffID(e.target.value)}
                            required
                            aria-invalid={validStaffID ? "false" : "true"}
                            aria-describedby='uidnote'
                            onFocus={() => setStaffIDFocus(true)}
                            onBlur={() => setStaffIDFocus(false)}
                        ></input>
                        <p id='uidnote' className={staffIDFocus && StaffID && !validStaffID ? `${styles.instructions}` : `${styles.offscreen}`}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Please enter a valid UTM StaffID.
                        </p>

                        <label htmlFor="username" className={styles.label}>
                            Staff Role:
                        </label>

                        <select className={styles.option} required onChange={(e) => setRole(e.target.value)}>
                            <option value="" disabled selected>Select an option</option>
                            <option value="admin">UTMFleet Management Admin</option>
                            <option value="driver">UTMFleet Bus Driver</option>
                        </select>

                        {role === 'driver' && (
                            <>
                                <label htmlFor="username" className={styles.label}>
                                    License Expiry:
                                    {DriverExpiry && (
                                        <>
                                            <span className={(role) ? styles.hide : styles.invalid}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </span>
                                            <span className={role ? styles.valid : styles.hide}>
                                                <FontAwesomeIcon icon={faCheck} />
                                            </span>
                                        </>
                                    )}
                                </label>
                                <input
                                    className={styles.input}
                                    type="date"
                                    id="licenseexpiry"
                                    autoComplete='off'
                                    onChange={(e) => setDriverExpiry(e.target.value)}
                                    required
                                    aria-invalid={validStaffID ? "false" : "true"}
                                    aria-describedby='uidnote'
                                    onFocus={() => setDriverExpiryFocus(true)}
                                    onBlur={() => setDriverExpiryFocus(false)}
                                />
                            </>
                        )}


                        {/* Sign Up Button */}
                        <button className={styles.button} disabled={!validName || usernameExists}>Add New Staff</button>
                    </form>
                </section>
            )
            }
        </div >
    );
};

export default AddNewStaff