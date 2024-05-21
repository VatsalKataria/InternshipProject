import Navbar from './Components/Navbar';
import AddData from './Components/AddData';
import Register from './Components/Register';
import Login from './Components/Login';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DashBoard from './Components/DashBoard';
import DisplayMachine from './Components/DisplayMachine';
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
          path="/adddata"
          element={user ? <AddData /> : <Navigate to="/" />}
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
          element={user ? <DisplayMachine /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

App.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func
};

export default App;
