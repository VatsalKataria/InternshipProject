import { useState } from "react";
import PropTypes from 'prop-types';
import { useNavigate, Link } from "react-router-dom";
import fb_logo from "/src/assets/fb.png"
import ig_logo from "/src/assets/ig.png"
import x_logo from "/src/assets/x.png"


const Login = ({ setUser,user })=>{

    const [ ECode, setECode ] = useState('')
    const [ Password, setPassword ] = useState('')
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ECode, Password }),
                credentials: 'include'
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Login Successful', result);
                setUser(result.user)
                setECode('');
                setPassword('');
                setError('');
                // setSuccess('Login Successful!');
                navigate('/dashboard');
            } else {
                const result = await response.json();
                console.error('Failed to Login', result.message);
                setError(result.message);
                // setSuccess('');
            }
        } catch (error) {
            console.error('Error: ', error )
            setError('Error occured during Login')
            // setSuccess('');
        }
    }

    return(
        <>
        <div className="login-container">
            <div className="left-pane">
                <div className="brand">
                    <h1>BlueStar <br />E-Cell</h1>
                    <p>use of the website</p>
                    <div className="social-icons">
                        <a href='#'><img src={fb_logo} alt="fb-logo" /></a>
                        <a href='#'><img src={ig_logo} alt="ig-logo" /></a>
                        <a href='#'><img src={x_logo} alt="x-logo" /></a>
                    </div>
                </div>
            </div>
            <div className="login-box">
                <h1>Welcome User</h1>
                <h3>Please Enter your Login info</h3>
                <form onSubmit={handleSubmit}>
                    <p>E-Code: <input type="text" value={ECode} onChange={(e) => setECode(e.target.value)} /></p>
                    <p>Password: <input type="password" value={Password} onChange={(e) => setPassword(e.target.value)} /></p>
                    <p> <input type="checkbox" />Remember me</p>
                    {error && <p className="LoginFalse">{error}</p>}
                    <button className="login-button" type="submit">Login</button>
                    <p className="contact-admin">Don&apos;t have and account? contact Admin</p>
                </form>
                {user && user.role === 'admin' && (
                    <p>Don&apos;t have and account?<Link to='/register' >Register Here</Link></p>)}
            </div>
        </div>
        </>
    )
}

Login.propTypes = {
    setUser: PropTypes.func.isRequired,
    user: PropTypes.object
}

export default Login;