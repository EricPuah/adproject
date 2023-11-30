import { useRef, useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './context/Authenticator';
import { authenticateUser } from './firebase';
import styles from './Login.module.css'

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [user, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        authenticateUser(user, password, setAuth, setSuccess, setErrMsg, errRef); //Authentication Backend
    };

    return (
        <>
            {
                success ? (
                    <section className={styles.section} >
                        <Navigate to="/private" />
                    </section>
                ) : (
                    <section className={styles.section}>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <img className={styles.img} src="https://i.imgur.com/mTwMfDE.png" alt='UTMFleet Logo'></img>
                            <label className={styles.label} htmlFor='username'>Username:</label>
                            <input className={styles.input}
                                type='text'
                                id='username'
                                ref={userRef}
                                autoComplete='off'
                                onChange={(e) => setUser(e.target.value)}
                                value={user}
                                required
                            ></input>
                            <label className={styles.label} htmlFor='password'>Password:</label>
                            <input className={styles.input}
                                type='password'
                                id='password'
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                            ></input>
                            <button className={styles.button}>Login</button>
                            <a className={styles.a} href='/changepassword'>Forgot Password</a>
                            <p
                                ref={errRef}
                                className={errMsg ? styles.errMsg : styles.offscreen}
                                aria-live='assertive'
                            >
                                {errMsg}
                            </p>
                        </form>
                    </section>
                )
            }
        </>
    );
};

export default Login;