import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { VacationModel } from '../../model/VacationModel';
import { editVacation, getVacations, uploadVacationImage } from '../../api/vactions/vactions-api';
import { updateVacation } from '../../store/slices/vacationslice';
import { Form, Button, Alert, Spinner, Image } from 'react-bootstrap';

const EditVacationForm: React.FC = () => {
    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();
    const [vacation, setVacation] = useState<VacationModel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    useEffect(() => {
        if (id) {
            getVacations(Number(id))
                .then(data => {
                    if (data.length > 0) {
                        setVacation(data[0]); // Assuming the response is an array with one object
                    } else {
                        setError('Vacation not found');
                    }
                    setIsLoading(false);
                })
                .catch(err => {
                    setError('Failed to fetch vacation details');
                    setIsLoading(false);
                });
        }
    }, [id]);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Strip out non-numeric characters except for period
        const formattedValue = e.target.value.replace(/[^0-9.]/g, '');
        setVacation(prev => prev ? { ...prev, price: parseFloat(formattedValue) || 0 } : prev);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (user?.token && vacation) {
            try {
                if (selectedImage) {
                    await uploadVacationImage(Number(id), selectedImage, user.token); // Upload the image file
                    vacation.imageFileName = selectedImage.name; // Update the vacation with the new image file name
                }
                await editVacation(Number(id), vacation, user.token);
                setSuccessMessage('Vacation updated successfully!');
                dispatch(updateVacation(vacation)); // Update state with the updated vacation
                navigate('/vacations');
            } catch (err) {
                setError('Failed to update vacation');
            }
        } else {
            setError('User token is missing or vacation data is incomplete');
        }
    };

    const formatDate = (date: string | undefined) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    if (isLoading) return <Spinner animation="border" />;

    return (
        <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            
            <Form.Group controlId="destination">
                <Form.Label>Destination:</Form.Label>
                <Form.Control
                    type="text"
                    value={vacation?.destination || ''}
                    onChange={(e) => setVacation({ ...vacation!, destination: e.target.value })}
                />
            </Form.Group>
            <Form.Group controlId="description">
                <Form.Label>Description:</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={vacation?.description || ''}
                    onChange={(e) => setVacation({ ...vacation!, description: e.target.value })}
                />
            </Form.Group>
            <Form.Group controlId="startDate">
                <Form.Label>Start Date:</Form.Label>
                <Form.Control
                    type="date"
                    value={formatDate(vacation?.startDate)}
                    onChange={(e) => setVacation({ ...vacation!, startDate: e.target.value })}
                />
            </Form.Group>
            <Form.Group controlId="endDate">
                <Form.Label>End Date:</Form.Label>
                <Form.Control
                    type="date"
                    value={formatDate(vacation?.endDate)}
                    onChange={(e) => setVacation({ ...vacation!, endDate: e.target.value })}
                />
            </Form.Group>
            <Form.Group controlId="price">
                <Form.Label>Price:</Form.Label>
                <Form.Control
                    type="text"
                    value={`$${vacation?.price || ''}`} // Display the price with $
                    onChange={handlePriceChange}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Current Image:</Form.Label>
                {vacation?.imageFileName && (
                    <Image
                        src={`path/to/images/${vacation.imageFileName}`} // Adjust the path as necessary
                        alt="Current vacation"
                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                    />
                )}
            </Form.Group>
            <Form.Group controlId="newImage">
                <Form.Label>New Image:</Form.Label>
                <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                Update Vacation
            </Button>
        </Form>
    );
};

export default EditVacationForm;
