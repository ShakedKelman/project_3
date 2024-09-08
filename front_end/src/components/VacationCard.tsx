import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VacationModel } from '../model/VacationModel';
import { getVacations } from '../api/vactions-api';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
    const year = date.getUTCFullYear().toString().slice(-2); // Last two digits of the year

    return `${day}/${month}/${year}`;
};

const VacationCard: React.FC = () => {
    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchVacations = async () => {
            try {
                const fetchedVacations = await getVacations();
                setVacations(fetchedVacations);
            } catch (error) {
                console.error("Error fetching vacations:", error);
            }
        };

        fetchVacations();
    }, []);

    const handleAddVacation = () => {
        // Navigate to the AddVacationForm component
        navigate('/add-vacation');
    };

    return (
        <div>
            <h1>Vacations</h1>
            <Row xs={1} md={2} lg={3} className="g-4">
                {vacations.map(vacation => (
                    <Col key={vacation.id}>
                        <Card>
                            <Card.Img variant="top" src={vacation.imageFileName} />
                            <Card.Body>
                                <Card.Title>{vacation.destination}</Card.Title>
                                <Card.Text>{vacation.description}</Card.Text>
                                <Card.Text>
                                    {`Start Date: ${formatDate(vacation.startDate)}`}
                                </Card.Text>
                                <Card.Text>
                                    {`End Date: ${formatDate(vacation.endDate)}`}
                                </Card.Text>
                                <Card.Text>{`Price: $${vacation.price}`}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Button variant="success" onClick={handleAddVacation} className="mt-3">Add Vacation</Button>
        </div>
    );
};

export default VacationCard;
