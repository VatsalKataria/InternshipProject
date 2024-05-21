import { useEffect, useState } from "react";

const DisplayMachine = () => {
    const [machines, setMachines] = useState([]);

    useEffect(() => {
        const fetchMachines = async () => {
            try {
                const response = await fetch('http://localhost:3000/machines');
                const data = await response.json();
                setMachines(data);
            } catch (error) {
                console.error('Error Fetching Machines', error)
            }
        };

        fetchMachines();
    }, []);

    return (
        <>
            <div>
                <h2>Machines List</h2>
                {machines.map((machine, index) => (
                    <div key={index}>
                        <h3>{machine.machineName}</h3>
                        <ul>
                            {machine.components.map((component, compIndex) => (
                                <li key={compIndex}>
                                    {component.name}: {component.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    );
}

export default DisplayMachine;
