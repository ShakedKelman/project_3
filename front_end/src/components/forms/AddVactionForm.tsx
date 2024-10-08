import React, { useState } from 'react';
import { VacationModel } from '../../model/VacationModel';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useAppDispatch } from '../../store/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import { apiAddVacation } from '../../api/vactions/vactions-api';
import { addVacation } from '../../store/slices/vacationslice';
import { fetchPaginatedVacations, fetchVacations } from '../../api/vactions/vacationsThunk';

interface VacationsProps {
    token?: string;
 }

const AddVacationForm: React.FC<VacationsProps> = (props)  => {
    const [newVacation, setNewVacation] = useState<VacationModel>(new VacationModel({}));
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { token } = props;

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
            setImageFile(e.target.files[0]);
        }
    };

    const isDateInThePast = (date: string) => {
        return new Date(date) < new Date();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isDateInThePast(newVacation.startDate) || isDateInThePast(newVacation.endDate)) {
            setError("Start Date and End Date must be in the future.");
            return;
        }

        if (new Date(newVacation.startDate) > new Date(newVacation.endDate)) {
            setError("End Date must be after Start Date.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('destination', newVacation.destination);
            formData.append('description', newVacation.description);
            formData.append('startDate', newVacation.startDate);
            formData.append('endDate', newVacation.endDate);
            formData.append('price', newVacation.price.toString());
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const addedVacation = await apiAddVacation(formData);
            dispatch(addVacation(addedVacation)); // Dispatch action to add vacation to Redux store
            dispatch(fetchVacations({token})); // Fetch all vacations to update the dropdown
            dispatch(fetchPaginatedVacations({ page: 1, limit: 10, token })); // Fetch paginated vacations
            setSuccess("Vacation added successfully");
            navigate('/vacations');
        } catch (error: any) {
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
<h2 className="my-4 text-center">Add New Vacation</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#007B7F', padding: '20px', borderRadius: '5px', color:"white" }}>
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
            step="1" // Change step to 1 to increment/decrement by 1
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

                <Button 
                    variant="success" 
                    type="submit" 
                    style={{ backgroundColor: '#85f5e9', color: 'black', marginTop: '20px', padding: '10px 20px' }}
                >
                    Add Vacation
                </Button>
            </Form>
        </div>
    );
};

export default AddVacationForm;
