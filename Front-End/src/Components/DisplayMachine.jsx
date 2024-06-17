import { useEffect, useState } from "react";

const DisplayMachine = () => {
    const [machines, setMachines] = useState([]);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({ category: '', date: '' });

    useEffect(() => {
        const fetchMachines = async () => {
            try {
                const response = await fetch('http://localhost:3000/machines', {
                    credentials: 'include'
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Unauthorized');
                    }
                    throw new Error('HTTP error ' + response.status);
                }
                const data = await response.json();
                setMachines(data);
            } catch (error) {
                setError(error.message);
                console.error('Error Fetching Machines', error);
            }
        };

        fetchMachines();
    }, []);

    const isValidDate = (dateString) => {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    };

    const filteredMachines = machines.filter(machine => {
        return machine.components.some(component => {
            const matchesCategory = filter.category ? component.category?.toLowerCase().includes(filter.category.toLowerCase()) : true;
            const matchesDate = filter.date && isValidDate(machine.createdAt) 
                ? new Date(machine.createdAt).toISOString().split('T')[0] === filter.date 
                : true;
            return matchesCategory && matchesDate;
        });
    });

    return (
        <>
            <div className="display-container">
                <div className="page-title">
                    <h2>Machines List</h2>
                </div>
                <div className="machine-list">
                    <div className="filter-bar">
                        <input
                            className="search-bar"
                            type="text" 
                            placeholder="Search by category" 
                            value={filter.category} 
                            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                        />
                        <input 
                            type="date" 
                            placeholder="Filter by date" 
                            value={filter.date} 
                            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                        />
                    </div>
                    {error ? (
                        <p>Error: {error}</p>
                    ) : (
                        filteredMachines.length > 0 ? (
                            filteredMachines.map((machine, index) => (
                                <div key={index}>
                                    <h3>{machine.machineName}</h3>
                                    <ul>
                                        {machine.components.map((component, compIndex) => (
                                            <li key={compIndex}>
                                                <strong>{component.name}</strong> (Category: {component.category})
                                                <p>{component.description}</p>
                                                <button className="display-img-button" onClick={() => window.open(`http://localhost:3000/images/${component.image}`, '_blank')}>
                                                    View Image
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <p>No machines match the search criteria</p>
                        )
                    )}
                </div>
            </div>
        </>
    );
}

export default DisplayMachine;
