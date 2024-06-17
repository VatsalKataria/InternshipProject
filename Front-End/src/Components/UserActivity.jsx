import { useEffect, useState } from 'react';
import axios from 'axios';

const UserActivity = () => {
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const response = await axios.get('http://localhost:3000/activity', {
                params: {
                    username: search,
                    startDate,
                    endDate
                },
                withCredentials: true
            });
            setActivities(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching activities');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchActivities();
    };

    return (
        <div className='activity-container'>
            <h1 className='page-title'>Login Activities</h1>
            <div className='activities'>
                <div className='filter-bar'>
                    <form onSubmit={handleSearch}>
                        <div className='name-search-bar'>
                            <label>Name: </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by username"
                            />
                        </div>
                        <label>Start Date:</label>
                        <input
                            type="date"
                            value={startDate}
                            className='date-filter'
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <label>End Date:</label>
                        <input
                            type="date"
                            value={endDate}
                            className='date-filter'
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        <button type="submit" className='update-delete-button'>Search</button>
                    </form>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <table className='activity-table'>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Activity Type</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.map((activity) => (
                            <tr key={activity._id}>
                                <td>{activity.username}</td>
                                <td>{activity.activityType}</td>
                                <td>{new Date(activity.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserActivity;
