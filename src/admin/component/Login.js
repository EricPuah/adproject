import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from './context/Authenticator';
import { db } from './firebase';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';

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

        try {
            const usersRef = ref(db, 'Admin');
            const userQuery = query(usersRef, orderByChild('username'), equalTo(user));

            onValue(userQuery, (snapshot) => {
                if (snapshot.exists()) {
                    const userDataValue = snapshot.val();
                    
                    for (const adminKey in userDataValue)  {
                        const adminData = userDataValue[adminKey];

                        if (adminData.username === user && adminData.password === password) {
                            console.log('Password matched');
                            setAuth({ user, password });
                            setSuccess(true);
                        }
                    }
                        console.log('Incorrect password');
                        setErrMsg('Incorrect password');
                        errRef.current.focus();
                } else {
                    console.log('User not found');
                    setErrMsg('User not found');
                    errRef.current.focus();
                }
            });
        } catch (err) {
            console.error('Firebase Error:', err);
            setErrMsg('An error occurred: ' + err.message);
            errRef.current.focus();
        }
    };

    return (
        <>
            {
                success ? (
                    <section>
                        <h1>You are logged in!</h1>
                        <br />
                        <p>
                            <a href='/'>Go to Home</a>
                        </p>
                    </section>
                ) : (
                    <section>
                        <p
                            ref={errRef}
                            className={errMsg ? 'errmsg' : 'offscreen'}
                            aria-live='assertive'
                        >
                            {errMsg}
                        </p>
                        <h1>Sign In</h1>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor='username'>UserName:</label>
                            <input
                                type='text'
                                id='username'
                                ref={userRef}
                                autoComplete='off'
                                onChange={(e) => setUser(e.target.value)}
                                value={user}
                                required
                            ></input>
                            <label htmlFor='password'>Password:</label>
                            <input
                                type='password'
                                id='password'
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                            ></input>
                            <button>Sign In</button>
                        </form>
                        <a href='/'>Forgot Password</a>
                    </section>
                )
            }
        </>
    );
};

export default Login;