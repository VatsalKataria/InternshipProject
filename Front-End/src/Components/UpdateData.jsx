import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const UpdateData = () => {
  const [existingData, setExistingData] = useState([]);
  const [filter, setFilter] = useState({ machineName: '', componentName: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/machines', {
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
      const response = await fetch(`http://localhost:3000/api/machines/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove deleted data from existingData state
        setExistingData(prevData => prevData.filter(item => item._id !== id));
      } else {
        console.error('Failed to delete data');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const filteredData = existingData.filter(data => {
    const matchesMachineName = filter.machineName 
      ? data.machineName.toLowerCase().includes(filter.machineName.toLowerCase())
      : true;
    const matchesComponentName = filter.componentName
      ? data.components.some(component => 
          component.name.toLowerCase().includes(filter.componentName.toLowerCase()))
      : true;
    return matchesMachineName && matchesComponentName;
  });

  return (
    <div className="update-container">
      <div className="page-title">
        <h2>Update or Delete Existing Data</h2>
      </div>
      <div className="update-machine-list">
        <div className="filter-bar">
          <input 
            className="search-bar"
            type="text" 
            placeholder="Search by machine name" 
            value={filter.machineName} 
            onChange={(e) => setFilter({ ...filter, machineName: e.target.value })}
          />
          <input 
            className="search-bar"
            type="text" 
            placeholder="Search by component name" 
            value={filter.componentName} 
            onChange={(e) => setFilter({ ...filter, componentName: e.target.value })}
          />
        </div>
        <ul>
          {filteredData.map((data) => (
            <li key={data._id}>
              <h3>
                Machine Name: {data.machineName}
              </h3>
              <p>
                Components:
                <ul>
                  {data.components.map((component, componentIndex) => (
                    <li key={`${data._id}-${componentIndex}`}>
                      Name: {component.name}, Description: {component.description}
                    </li>
                  ))}
                </ul>
              </p>
              <button className="update-delete-button" onClick={() => handleUpdate(data._id, data)}>Update</button>
              <button className="update-delete-button" onClick={() => handleDelete(data._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UpdateData;
