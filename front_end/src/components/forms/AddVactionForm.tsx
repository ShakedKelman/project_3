import React, { useState } from 'react';
import { VacationModel } from '../../model/VacationModel';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, InputGroup, Col, Row } from 'react-bootstrap';
import { RootState, useAppDispatch } from '../../store/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import { apiAddVacation } from '../../api/vactions/vactions-api';
import { addVacation } from '../../store/slices/vacationslice';
import { fetchPaginatedVacations, fetchVacations } from '../../api/vactions/vacationsThunk';
import '../../css/addVacationForm.css';  
import { useSelector } from 'react-redux';



const AddVacationForm: React.FC = () => {
    const { token } = useSelector((state: RootState) => state.auth);
    const [newVacation, setNewVacation] = useState<VacationModel>(new VacationModel({}));
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();


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

        if (!token) {
            setError("Authentication required");
            return;
        }
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
            dispatch(fetchVacations({ token: token || undefined }));
            dispatch(fetchPaginatedVacations({
                page: 1,
                limit: 10,
                token: token || undefined
            }));
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
        <div className="add-vacation-container">
            <h2 className="add-vacation-title">Add New Vacation</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} controlId="formDestination">
                    <Form.Label column sm={3}>Destination</Form.Label>
                    <Col sm={9}>
                    <Form.Control
                        type="text"
                        name="destination"
                        value={newVacation.destination}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter destination"
                    />
                    </Col>  
                </Form.Group>

                <Form.Group as={Row} controlId="formDescription">
                    <Form.Label column sm={3}>Description</Form.Label>
                    <Col sm={9}>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={newVacation.description}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter description"
                    />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formStartDate">
                    <Form.Label column sm={3}>Start Date</Form.Label>
                    <Col sm={9}>
                    <Form.Control
                        type="date"
                        name="startDate"
                        value={newVacation.startDate}
                        onChange={handleInputChange}
                        required
                    />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formEndDate">
                    <Form.Label column sm={3}>End Date</Form.Label>
                    <Col sm={9}>
                    <Form.Control
                        type="date"
                        name="endDate"
                        value={newVacation.endDate}
                        onChange={handleInputChange}
                        required
                    />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formPrice">
                    <Form.Label column sm={3}>Price</Form.Label>
                    <Col sm={9}>
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
                            step="1" 
                        />
                    </InputGroup>
                    </Col>
                </Form.Group>


                <Form.Group as={Row} controlId="formImage">
                    <Form.Label column sm={3}>Upload Image</Form.Label>
                    <Col sm={9}>
                    <Form.Control
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        required
                    />
                    </Col>
                </Form.Group>
                <Button
                    variant="outline-light"
                    type="submit"
                    style={{ margin: '10px' }}
                    className="submit-button"
                >
                    Add Vacation
                </Button>
            </Form>
        </div>
    );
};

export default AddVacationForm;
