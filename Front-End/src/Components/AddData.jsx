import { useState } from "react";

const AddData = () => {
    const [machineName, setMachineName] = useState('');
    const [components, setComponents] = useState([{ name: '', description: '' }]);

    const handleComponentChange = (index, event) => {
        const updatedComponents = [...components];
        updatedComponents[index][event.target.name] = event.target.value;
        setComponents(updatedComponents);
    };

    const handleAddComponent = () => {
        setComponents([...components, { name: '', description: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/adddata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ machineName, components })
            });

            if (response.ok) {
                console.log('Data Added Successfully!!');
                setMachineName('');
                setComponents([{ name: '', description: '' }]);
            } else {
                console.error('Failed to Add data to the DB');
            }
        } catch (error) {
            console.error('Error', error);
        }
    };

    return (
        <>
            <div>
                <h2>Add New Machine</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        Machine Name: <input type="text" value={machineName} onChange={(e) => setMachineName(e.target.value)} />
                    </div>
                    {components.map((component, index) => (
                        <div key={index}>
                            <div>
                                Component Name: <input type="text" name="name" value={component.name} onChange={(e) => handleComponentChange(index, e)} />
                            </div>
                            <div>
                                Component Description: <input type="text" name="description" value={component.description} onChange={(e) => handleComponentChange(index, e)} />
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddComponent}>Add Component</button>
                    <br />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    );
};

export default AddData;
