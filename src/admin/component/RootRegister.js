import { useRef, useState, useEffect } from 'react';
import { faCheck, faTimes, faInfoCircle, faFontAwesome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './RootRegister.module.css';
import { registerUserInFirebase, checkRepeatedUser } from "./firebase";
import AdminNavbar from './../component/pages/AdminNavbar';


//Allowed Characters
//Password: Must consists 1 lowercase, 1 uppercase, 1 numerical, 1 special character
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const RootRegister = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);
    const [usernameExists, setUsernameExists] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [matchPassword, setMatchPassword] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

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

    //Validate password match
    useEffect(() => {
        const result = PASSWORD_REGEX.test(password);
        setValidPassword(result);
        setValidMatch(password === matchPassword);
    }, [password, matchPassword]);

    //Set Error Message
    useEffect(() => {
        setErrMsg('');
    }, [user, password, matchPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validName || !validPassword || !validMatch) {
            setErrMsg('Please fill out the form correctly.');
            return;
        }

        try {
            await registerUserInFirebase(user, password); //Register user into DB
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

                            {/* Password Field & Validation Output*/}
                            <label htmlFor="password" className={styles.label}>
                                Password:
                                <FontAwesomeIcon icon={faCheck} className={validPassword ? `${styles.valid}` : `${styles.hide}`} />
                                <FontAwesomeIcon icon={faTimes} className={(validPassword || !password) ? `${styles.hide}` : `${styles.invalid}`} />
                            </label>
                            <input className={styles.input}
                                type="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                aria-invalid={validPassword ? "false" : "true"}
                                aria-describedby='pwdnote'
                                onFocus={() => setPasswordFocus(true)}
                                onBlur={() => setPasswordFocus(false)}
                            ></input>
                            <p id='pwdnote' className={passwordFocus && !validPassword ? `${styles.instructions}` : `${styles.offscreen}`}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                8 to 24 characters.<br />
                                Must include uppercase and lowercase letters, a number, and a special character.<br />
                                Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                            </p>
                            {/* Confirm Password & Validation Output */}
                            <label htmlFor="confirm_pwd" className={styles.label}>
                                Confirm Password:
                                <FontAwesomeIcon icon={faCheck} className={validMatch && matchPassword ? `${styles.valid}` : `${styles.hide}`} />
                                <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPassword ? `${styles.hide}` : `${styles.invalid}`} />
                            </label>
                            <input className={styles.input}
                                type="password"
                                id="confirm_pwd"
                                onChange={(e) => setMatchPassword(e.target.value)}
                                value={matchPassword}
                                required
                                aria-invalid={validMatch ? "false" : "true"}
                                aria-describedby="confirmnote"
                                onFocus={() => setMatchFocus(true)}
                                onBlur={() => setMatchFocus(false)}
                            />
                            <p id="confirmnote" className={matchFocus && !validMatch ? `${styles.instructions}` : `${styles.offscreen}`}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Must match the first password input field.
                            </p>
                            {/* Sign Up Button */}
                            <button className={styles.button} disabled={!validMatch || !validName || !validPassword || usernameExists}>Sign Up</button>
                        </form>
                    </section>
                )}
            </div>
    );
};

export default RootRegister