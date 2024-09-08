import React, { useState } from 'react';
import { VacationModel } from '../model/VacationModel';
import { addVacation } from '../api/vactions-api';
import { useNavigate } from 'react-router-dom';

const AddVacationForm: React.FC = () => {
    const [newVacation, setNewVacation] = useState<VacationModel>(new VacationModel({}));
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewVacation(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addVacation(newVacation);
            setSuccess("Vacation added successfully");
            console.log("Vacation added successfully:", newVacation);

            // Optionally, navigate to another page after successful submission
            navigate('/vacations'); // Navigate to the homepage or another route
        } catch (error) {
            setError("Failed to add vacation");
            console.error("Error adding vacation:", error);
        }
    };

    return (
        <div>
            <h2>Add New Vacation</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Destination:
                    <input
                        type="text"
                        name="destination"
                        value={newVacation.destination}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={newVacation.description}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Start Date:
                    <input
                        type="date"
                        name="startDate"
                        value={newVacation.startDate}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    End Date:
                    <input
                        type="date"
                        name="endDate"
                        value={newVacation.endDate}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Price:
                    <input
                        type="number"
                        name="price"
                        value={newVacation.price}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Image File Name:
                    <input
                        type="text"
                        name="imageFileName"
                        value={newVacation.imageFileName || ''}
                        onChange={handleInputChange}
                    />
                </label>
                <button type="submit">Add Vacation</button>
            </form>
        </div>
    );
};

export default AddVacationForm;
