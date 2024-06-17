import PropTypes from 'prop-types';
import Logo from "/src/assets/BSL-logo.png";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setUser(null);
        navigate('/');
        alert('Logout Successful');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="Navbar">
      <img src={Logo} alt="Logo" className="Nav-logo" />
      <ul className="Nav-list">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/contactus">Contact Us</Link></li>
        <li><Link to="/aboutus">About Us</Link></li>
        {user ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            {user.role === 'admin' && (
              <>
                <li><Link to="/adddata">Add Data</Link></li>
                <li><Link to="/updatedata">Update Data</Link></li>
                <li><Link to="/machines">Display Machines</Link></li>
                <li><Link to="/register">Register User</Link></li>
                <li><Link to="/login-activities">Login Activities</Link></li> {/* New Link */}
              </>
            )}
            {user.role === 'user' && (
              <>
                <li><Link to="/machines">Display Machines</Link></li>
              </>
            )}
            <li onClick={handleLogout}>Logout</li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </div>
  );
};

Navbar.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func.isRequired
};

export default Navbar;
