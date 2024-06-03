import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const UpdateData = () => {
  const [existingData, setExistingData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/machines', {
          credentials: 'include' // Include credentials such as cookies
        });
        if (response.ok) {
          const data = await response.json();
          setExistingData(data);
        } else {
          console.error('Failed to fetch existing data');
        }
      } catch (error) {
        console.error('Error fetching existing data:', error);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = (id, data) => {
    if (!id) {
      console.error('No id provided for update');
      return;
    }
    navigate('/adddata', { state: { data } });
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error('No id provided for delete');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/machines/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove deleted data from existingData state
        setExistingData(prevData => prevData.filter(item => item.id !== id));
      } else {
        console.error('Failed to delete data');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  return (
    <div>
      <h2>Update or Delete Existing Data</h2>
      <ul>
        {existingData.map((data) => (
          <li key={data.id}>
            <div>Machine Name: {data.machineName}</div>
            <div>
              Components:
              <ul>
                {data.components.map((component, componentIndex) => (
                  <li key={`${data.id}-${componentIndex}`}>
                    Name: {component.name}, Description: {component.description}
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={() => handleUpdate(data.id, data)}>Update</button>
            <button onClick={() => handleDelete(data.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpdateData;
