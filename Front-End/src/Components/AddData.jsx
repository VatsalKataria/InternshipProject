import { useState } from "react";
import { useLocation } from 'react-router-dom';

const AddData = () => {
    const location = useLocation();
    const [machineName, setMachineName] = useState(location.state?.data?.machineName || '');
    const [components, setComponents] = useState(location.state?.data?.components || [{ name: '', description: '', image: null, preview: '' }]);

    const handleComponentChange = (index, event) => {
        const updatedComponents = [...components];
        if (event.target.name === 'image') {
            const file = event.target.files[0];
            updatedComponents[index][event.target.name] = file;
            updatedComponents[index].preview = URL.createObjectURL(file);
        } else {
            updatedComponents[index][event.target.name] = event.target.value;
        }
        setComponents(updatedComponents);
    };

    const handleAddComponent = () => {
        setComponents([...components, { name: '', description: '', image: null, preview: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('machineName', machineName);
        formData.append('components', JSON.stringify(components));
        components.forEach((component, index) => {
            formData.append(`images_${index}`, component.image);
        });

        try {
            const response = await fetch('http://localhost:3000/adddata', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                console.log('Data Added Successfully!!');
                setMachineName('');
                setComponents([{ name: '', description: '', image: null, preview: '' }]);
            } else {
                console.error('Failed to add data to the DB');
            }
        } catch (error) {
            console.error('Error', error);
        }
    };

    return (
        <div className="adding-container">
            <div className="page-title">
                <h2>{location.state ? 'Update Machine' : 'Add New Machine'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="adding-box">
                    <h2>
                        Enter Machine Details
                    </h2>
                <p>
                Machine Name: <input type="text" value={machineName} onChange={(e) => setMachineName(e.target.value)} required />
                </p>
                {components.map((component, index) => (
                    <div key={index} className="components">
                        <p>
                        Component Name: <input type="text" name="name" value={component.name} onChange={(e) => handleComponentChange(index, e)} required />
                        </p>
                        <p>
                        Component Description: <input type="text" name="description" value={component.description} onChange={(e) => handleComponentChange(index, e)} required />
                        </p>
                        <p>
                        Component Image: <input type="file" name="image" onChange={(e) => handleComponentChange(index, e)} required />
                        {component.preview && <img src={component.preview} alt="Preview" style={{ width: '100px', height: '100px' }} />}
                        </p>
                    </div>
                ))}
                <button type="button" onClick={handleAddComponent}>Add Component</button>
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AddData;
