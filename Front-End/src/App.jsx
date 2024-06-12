import Navbar from './Components/Navbar';
import ContactUs from './Components/ContactUs';
import AboutUs from './Components/AboutUs';
import AddData from './Components/AddData';
import Register from './Components/Register';
import Login from './Components/Login';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DashBoard from './Components/DashBoard';
import DisplayMachine from './Components/DisplayMachine';
import UpdateData from './Components/UpdateData';
import Footer from './Components/Footer';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:3000/session', { credentials: 'include' });
        if (response.ok) {
          const result = await response.json();
          console.log('User object from session check:', result.user);
          setUser(result.user);
        } else if (response.status === 401) {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking session: ', error);
      }
    };
    checkSession();
  }, []);

  return (
    <div className='wrapper'>
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route
          exact
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />}
          />
        <Route
          exact
          path="/dashboard"
          element={user ? <DashBoard user={user} /> : <Navigate to="/" />}
          />
        <Route
          exact
          path="/contactus"
          element={<ContactUs />} 
          />
        <Route 
          exact  
          path="/aboutus" 
          element={<AboutUs />}
           />
        <Route
          exact
          path="/adddata"
          element={user && user.role === 'admin' ? <AddData /> : <Navigate to="/" />}
          />
        <Route
          exact
          path="/register"
          element={user && user.role === 'admin' ? <Register user={user} /> : <Navigate to='/' />}
          />
        <Route
          exact
          path="/login"
          element={<Login setUser={setUser} />}
          />
        <Route
          exact
          path="/machines"
          element={<DisplayMachine />}
          />
        <Route
          exact
          path="/updatedata"
          element={user && user.role === 'admin' ? <UpdateData /> : <Navigate to="/" />}
          />
      </Routes>
      <Footer/>
    </Router>
</div>
  );
}

App.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func
};

export default App;
