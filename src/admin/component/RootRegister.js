import { useRef, useState, useEffect } from 'react';
import { faCheck, faTimes, faInfoCircle, faFontAwesome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './RootRegister.css'
import { registerUserInFirebase, checkRepeatedUser } from "./firebase";

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
        <>
            {
                success ? (
                    <section>
                        <h1>{user} signed up successfully!</h1>
                    </section>
                ) : (
                    <section>
                        {/* Register Form */}
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                        <h1>Register</h1>
                        <form onSubmit={handleSubmit}>
                            {/* Username Field & Validation Output */}
                            <label htmlFor="username">
                                Username:
                                {user && (
                                    <>
                                        <span className={(validName && !usernameExists) ? "hide" : "invalid"}>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </span>
                                        <span className={validName && !usernameExists ? "valid" : "hide"}>
                                            <FontAwesomeIcon icon={faCheck} />
                                        </span>
                                    </>
                                )}
                            </label>
                            <input
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
                            <p id='uidnote' className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                4 to 24 characters. <br />
                                Must begin with a letter. <br />
                                Letters, numbers, underscores, hyphens allowed. <br />
                            </p>
                            <p id='uidnote' className={(user && usernameExists) ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faTimes} className='invalid' />
                                The username has already been taken.
                            </p>

                            {/* Password Field & Validation Output*/}
                            <label htmlFor="password">
                                Password:
                                <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={(validPassword || !password) ? "hide" : "invalid"} />
                            </label>
                            <input
                                type="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                aria-invalid={validPassword ? "false" : "true"}
                                aria-describedby='pwdnote'
                                onFocus={() => setPasswordFocus(true)}
                                onBlur={() => setPasswordFocus(false)}
                            ></input>
                            <p id='pwdnote' className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                8 to 24 characters.<br />
                                Must include uppercase and lowercase letters, a number and a special character.<br />
                                Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                            </p>
                            {/* Confirm Password & Validation Output */}
                            <label htmlFor="confirm_pwd">
                                Confirm Password:
                                <FontAwesomeIcon icon={faCheck} className={validMatch && matchPassword ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPassword ? "hide" : "invalid"} />
                            </label>
                            <input
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
                            <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Must match the first password input field.
                            </p>
                            {/* Sign Up Button */}
                            <button disabled={!validMatch || !validName || !validPassword || usernameExists}>Sign Up</button>
                        </form>
                    </section>
                )}
        </>
    )
};

export default RootRegister