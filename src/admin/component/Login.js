import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from './context/Authenticator';
import { authenticateUser } from './firebase';
import './Login.css';

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
                        <form onSubmit={handleSubmit}>
                            <h1>Login</h1>
                            <label htmlFor='username'>Username:</label>
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
                            <button>Login</button>
                            <a href='/'>Forgot Password</a>
                        </form>
                    </section>
                )
            }
        </>
    );
};

export default Login;