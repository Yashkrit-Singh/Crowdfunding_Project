// src/components/CreateProjectForm/CreateProjectForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateProjectForm.css';

const CreateProjectForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    requiredAmount: '',
    documentation: ''
  });
  const Navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post('http://localhost:3000/projects', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Project created successfully:', response.data);
      alert('Project created successfully!');
      // Redirect or clear form after submission
      setFormData({
        name: '',
        description: '',
        image: '',
        requiredAmount: '',
        documentation: ''
      });
      Navigate('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  return (
    <div className="create-project-form-container">
      <h2>Create a New Project</h2>
      <form onSubmit={handleSubmit} className="create-project-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </label>

        <label>
          Image URL:
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Required Amount:
          <input
            type="number"
            name="requiredAmount"
            value={formData.requiredAmount}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Documentation (Links or Notes):
          <textarea
            name="documentation"
            value={formData.documentation}
            onChange={handleChange}
          ></textarea>
        </label>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default CreateProjectForm;
