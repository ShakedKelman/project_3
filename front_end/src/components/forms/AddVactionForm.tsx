import React, { useState } from 'react';
import { VacationModel } from '../../model/VacationModel';
import { addVacation } from '../../api/vactions/vactions-api';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddVacationForm: React.FC = () => {
    const [newVacation, setNewVacation] = useState<VacationModel>(new VacationModel({}));
    const [imageFile, setImageFile] = useState<File | null>(null); // State for image file
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewVacation(prev => ({ ...prev, [name]: value }));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewVacation(prev => ({
            ...prev,
            price: parseFloat(value) || 0
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageFile(e.target.files[0]); // Set the selected image file
        }
    };

    const isDateInThePast = (date: string) => {
        return new Date(date) < new Date();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        // Validate dates
        if (isDateInThePast(newVacation.startDate) || isDateInThePast(newVacation.endDate)) {
            setError("Start Date and End Date must be in the future.");
            return;
        }
    
        if (new Date(newVacation.startDate) > new Date(newVacation.endDate)) {
            setError("End Date must be after Start Date.");
            return;
        }
    
        try {
            // Create FormData object
            const formData = new FormData();
            formData.append('destination', newVacation.destination);
            formData.append('description', newVacation.description);
            formData.append('startDate', newVacation.startDate);
            formData.append('endDate', newVacation.endDate);
            formData.append('price', newVacation.price.toString()); // Send only the numeric value
            if (imageFile) {
                formData.append('image', imageFile);
            }
    
            // Call the addVacation API
            await addVacation(formData);
            setSuccess("Vacation added successfully");
            navigate('/vacations');
        } catch (error: any) {
            // Check if the error has a response from the backend
            if (error.response && error.response.data) {
                const backendMessage = error.response.data.message;
                setError(backendMessage || "Unknown error occurred");
            } else {
                setError("Unknown error occurred while adding vacation");
            }
            console.error("Error adding vacation:", error);
        }
    };
    
    return (
        <div className="container">
            <h2 className="my-4">Add New Vacation</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formDestination">
                    <Form.Label>Destination</Form.Label>
                    <Form.Control
                        type="text"
                        name="destination"
                        value={newVacation.destination}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter destination"
                    />
                </Form.Group>

                <Form.Group controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={newVacation.description}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter description"
                    />
                </Form.Group>

                <Form.Group controlId="formStartDate">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                        type="date"
                        name="startDate"
                        value={newVacation.startDate}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formEndDate">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                        type="date"
                        name="endDate"
                        value={newVacation.endDate}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPrice">
                    <Form.Label>Price</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control
                            type="number"
                            name="price"
                            value={newVacation.price || 0}
                            onChange={handlePriceChange}
                            required
                            placeholder="Enter price"
                            min="0"
                            step="0.01"
                        />
                    </InputGroup>
                </Form.Group>

                <Form.Group controlId="formImage">
                    <Form.Label>Upload Image</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        required
                    />
                </Form.Group>

                <Button variant="success" type="submit" className="mt-3">Add Vacation</Button>
            </Form>
        </div>
    );
};

export default AddVacationForm;
