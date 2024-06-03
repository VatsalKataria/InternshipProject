import PropTypes from 'prop-types';
const DashBoard = ({ user }) =>{
    return(
        <>
        <h1>This is dashboard</h1>
        {user && <p>Welcome, {user.Username}</p>}
        </>
    )
};

DashBoard.propTypes = {
    user: PropTypes.object
}

export default DashBoard;