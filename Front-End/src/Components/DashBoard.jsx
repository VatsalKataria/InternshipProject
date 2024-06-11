import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const DashBoard = ({ user }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if the device is a smartphone
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent));
    }, []);

    return (
        <>
            {user && <h1 className='dashboard-container'>
                Welcome, {user.Username}
                </h1>}
            {isMobile && (
                <p style={{ color: 'red', fontWeight: 'bold' }}>
                    For the best experience, please open this website on a PC/laptop.
                </p>
            )}
        </>
    );
};

DashBoard.propTypes = {
    user: PropTypes.object
};

export default DashBoard;
