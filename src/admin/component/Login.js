import { useRef, useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { authenticateUser } from './firebase';
import styles from './Login.module.css'
import { useSignIn } from 'react-auth-kit'
import Cookies from 'js-cookie';

const Login = () => {
    const signIn = useSignIn();
    //const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const cookieData = JSON.parse(Cookies.get('_auth_state'));
    const user_isRootAdmin = cookieData.isRootAdmin;
    const userRole = cookieData.role;

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [user, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        //authenticateUser(user, password, setAuth, setSuccess, setErrMsg, errRef); //Authentication Backend

        try {

            const response = await fetch('https://ad-server-js.vercel.app/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: user, password: password }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success) {
                signIn ({
                    token: data.token,
                    expiresIn: 36000,
                    tokenType: "Bearer",
                    authState: { username: user, isRootAdmin: data.isRootAdmin, role: data.role},
                })
                setSuccess(true);
            } else {
                setErrMsg(`Incorrect Username or Password.`);
            }
        } catch (error) {
            setErrMsg(`Incorrect Username or Password.`);
        }
    };

    return (
        <>
            {
                success ? (
                    userRole === 'driver' ? (
                        <section className={styles.section} >
                        <Navigate to="/DriverBusSelect" />
                        </section>
                    ) : (
                    <section className={styles.section} >
                        <Navigate to="/AdminMaps" />
                    </section>
                    )
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
                            <a className={styles.a} href='/resetpassword'>Forgot Password</a>
                            <p
                                ref={errRef}
                                className={errMsg ? styles.errMsg : styles.offscreen}
                                aria-live='assertive'
                            >
                                {errMsg}
                            </p>

                            <a className={styles.a} href='/UserMap'>User Main Page</a>
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