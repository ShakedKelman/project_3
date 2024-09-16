import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { VacationModel } from '../../model/VacationModel';
import { editVacation, getVacations, uploadVacationImage,  } from '../../api/vactions/vactions-api';
import { updateVacation } from '../../store/slices/vacationslice';
import { Form, Button, Alert, Spinner, Image } from 'react-bootstrap';
import { siteConfig } from '../../utils/SiteConfig';
import { deleteImage, getImagesForVacation } from '../../api/images/images-api'; // Import the function to get images

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
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        const fetchVacationDetails = async () => {
            if (id) {
                try {
                    const data = await getVacations(Number(id));
                    if (data.length > 0) {
                        setVacation(data[0]); // Assuming the response is an array with one object
                        const vacationImages = await getImagesForVacation(Number(id)); // Fetch images
                        setImages(vacationImages);
                    } else {
                        setError('Vacation not found');
                    }
                } catch (err) {
                    setError('Failed to fetch vacation details');
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchVacationDetails();
    }, [id]);

    const getImageUrl = (imagePath: string) => {
        return `${siteConfig.BASE_URL}${imagePath}`;
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = e.target.value.replace(/[^0-9.]/g, '');
        setVacation(prev => prev ? { ...prev, price: parseFloat(formattedValue) || 0 } : prev);
    };
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (user?.token && vacation) {
            try {
                const oldImageFileName = vacation.imageFileName;
    
                // Upload the new image if selected
                if (selectedImage) {
                    await uploadVacationImage(Number(id), selectedImage, user.token);
                    vacation.imageFileName = selectedImage.name;
                }
    
                // Delete the old image if necessary
                if (oldImageFileName && selectedImage) {
                    try {
                        await deleteImage(Number(id), oldImageFileName, user.token);
                    } catch (deleteError) {
                        console.error("Error deleting old image:", deleteError);
                        // Continue with the update even if image deletion fails
                    }
                }
    
                // Edit vacation details
                await editVacation(Number(id), vacation, user.token, vacation.imageFileName);
                setSuccessMessage('Vacation updated successfully!');
                dispatch(updateVacation(vacation));
                navigate('/vacations');
            } catch (err) {
                console.error(err);
                setError('Failed to update vacation');
            }
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
        type="number"
        value={vacation?.price || 0} // Ensure value is numeric
        onChange={handlePriceChange}
        min="0"
        step="1" // Set step to 1 to increment/decrement by 1
    />
</Form.Group>

            <Form.Group>
                <Form.Label>Current Image:</Form.Label>
                {vacation?.imageFileName && (
                    <Image
                        src={images.length > 0 ? getImageUrl(images[0]) : 'placeholder.jpg'}
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
