import { useState } from "react";
import { useLocation } from 'react-router-dom';

const AddData = () => {
    const location = useLocation();
    const [formType, setFormType] = useState(''); // State to manage form type (e.g., report, tutorial)
    const [formFields, setFormFields] = useState([]); // State to manage dynamic form fields

    const handleFieldChange = (index, event) => {
        const updatedFields = [...formFields];
        if (event.target.name === 'image' || event.target.name === 'video') {
            const file = event.target.files[0];
            updatedFields[index][event.target.name] = file;
            updatedFields[index].preview = URL.createObjectURL(file);
        } else {
            updatedFields[index] = { ...updatedFields[index], [event.target.name]: event.target.value };
        }
        setFormFields(updatedFields);
    };

    const handleAddField = () => {
        setFormFields([...formFields, { label: '', value: '', image: null, video: null, preview: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare form data
        const formData = new FormData();
        formData.append('formType', formType);
        formFields.forEach((field, index) => {
            formData.append(`field_${index}_label`, field.label);
            formData.append(`field_${index}_value`, field.value);
            if (field.image) {
                formData.append(`field_${index}_image`, field.image);
            }
            if (field.video) {
                formData.append(`field_${index}_video`, field.video);
            }
        });

        try {
            const response = await fetch('http://localhost:3000/submitform', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                console.log('Form Submitted Successfully!!');
                setFormType('');
                setFormFields([]);
            } else {
                console.error('Failed to submit the form');
            }
        } catch (error) {
            console.error('Error', error);
        }
    };

    return (
        <div className="adding-container">
            <div className="page-title">
                <h2>{location.state ? 'Update Form' : 'Create New Form'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="adding-box">
                <h2>
                    Enter Form Details
                </h2>
                <p>
                    Form Type:
                    <input type="text" value={formType} onChange={(e) => setFormType(e.target.value)} required />
                </p>
                {formFields.map((field, index) => (
                    <div key={index} className="form-field">
                        <p>
                            Field Label:
                            <input type="text" name="label" value={field.label} onChange={(e) => handleFieldChange(index, e)} required />
                        </p>
                        <p>
                            Field Value:
                            <input type="text" name="value" value={field.value} onChange={(e) => handleFieldChange(index, e)} required />
                        </p>
                        <p>
                            Upload Image:
                            <input type="file" name="image" onChange={(e) => handleFieldChange(index, e)} />
                            {field.preview && <img src={field.preview} alt="Image Preview" style={{ width: '100px', height: '100px' }} />}
                        </p>
                        <p>
                            Upload Video:
                            <input type="file" name="video" onChange={(e) => handleFieldChange(index, e)} />
                            {field.preview && <video src={field.preview} controls style={{ width: '100px', height: 'auto' }} />}
                        </p>
                    </div>
                ))}
                <button type="button" onClick={handleAddField}>Add Field</button>
                <br />
                <button type="submit">Submit Form</button>
            </form>
        </div>
    );
};

export default AddData;
