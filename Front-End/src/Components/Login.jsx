import { useState } from "react";
import PropTypes from 'prop-types';
import { useNavigate, Link } from "react-router-dom";

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
        <div className="login-box">
            <form onSubmit={handleSubmit}>
                <p>E-Code: <input type="text" value={ECode} onChange={(e) => setECode(e.target.value)} /></p>
                <p>Password: <input type="password" value={Password} onChange={(e) => setPassword(e.target.value)} /></p>
                {error && <p className="LoginFalse">{error}</p>}
                <button type="submit">Login</button>
            </form>
            {user && user.role === 'admin' && (
                <p>Don&apos;t have and account?<Link to='/register' >Register Here</Link></p>)}
        </div>
        </>
    )
}

Login.propTypes = {
    setUser: PropTypes.func.isRequired,
    user: PropTypes.object
}

export default Login;