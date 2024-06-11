import { useState } from "react";
import PropTypes from 'prop-types';

const Register = ({ user }) => {
    const [Username, setUsername] = useState('');
    const [emailAdd, setemailAdd] = useState('');
    const [ECode, setECode] = useState('');
    const [Password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Username, emailAdd, ECode, Password, role })
            });

            if (response.ok) {
                setUsername('');
                setemailAdd('');
                setECode('');
                setPassword('');
                setConfirmPassword('');
                setRole('user');
            } else {
                setError('Failed to register');
            }
        } catch (error) {
            setError('Error occurred during registration');
        }
    };

    return (
        <div className="register-container">
            <div className="page-title">
                <h1>
                    Register new User
                </h1>
            </div>
            <div className="register-box">
            <form onSubmit={handleSubmit}>
                <p>Username: <input type="text" value={Username} onChange={(e) => setUsername(e.target.value)} /></p>
                <p>E-mail Address: <input type="email" value={emailAdd} onChange={(e) => setemailAdd(e.target.value)} /></p>
                <p>E-Code: <input type="text" value={ECode} onChange={(e) => setECode(e.target.value)} /></p>
                <p>Password: <input type="password" value={Password} onChange={(e) => setPassword(e.target.value)} /></p>
                <p>Confirm Password: <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></p>
                {user && user.role === 'admin' && (
                    <p>Role:
                        <select className="role-select" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </p>
                )}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" className="register-button">Submit</button>
            </form>
        </div>
        </div>
    );
};

Register.propTypes = {
    user: PropTypes.object 
};

export default Register;
