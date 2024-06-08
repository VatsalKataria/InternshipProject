import { useEffect, useState } from "react";

const DisplayMachine = () => {
    const [machines, setMachines] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMachines = async () => {
            try {
                const response = await fetch('http://localhost:3000/machines', {
                    credentials: 'include' // Include credentials such as cookies
                });
                if (!response.ok) {
                    // Handle unauthorized error
                    if (response.status === 401) {
                        throw new Error('Unauthorized');
                    }
                    // Handle other HTTP errors
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

    return (
        <>
            <div className="display-container">
                <div className="page-title">
                <h2>Machines List</h2>
                </div>
                <div className="machine-list">
                {error ? (
                    <p>Error: {error}</p>
                ) : (
                    Array.isArray(machines) && machines.map((machine, index) => (
                        <div key={index}>
                            <h3>{machine.machineName}</h3>
                            <ul>
                                {machine.components.map((component, compIndex) => (
                                    <li key={compIndex}>
                                        {component.name}: {component.description}
                                        <button className="display-img-button" onClick={() => window.open(`http://localhost:3000/images/${component.image}`, '_blank')}>
                                            View Image
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
                </div>
            </div>
        </>
    );
}

export default DisplayMachine;
