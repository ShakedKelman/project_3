import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVacations } from '../api/vactions-api';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
};

const VacationCard: React.FC = () => {
  const [vacations, setVacations] = useState<any[]>([]);
  const navigate = useNavigate();

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
    navigate('/add-vacation');
  };

  return (
    <div>
      <h1>Vacations</h1>
      <Row>
        {vacations.map(vacation => (
          <Col key={vacation.id} md={4}>
            <Card>
            <Card.Img variant="top" src={vacation.imageUrl || 'placeholder.jpg'} />
              <Card.Body>
                <Card.Title>{vacation.destination}</Card.Title>
                <Card.Text>
                  {vacation.description}<br />
                  {`Start Date: ${formatDate(vacation.startDate)}`}<br />
                  {`End Date: ${formatDate(vacation.endDate)}`}<br />
                  {`Price: $${vacation.price}`}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Button onClick={handleAddVacation}>Add Vacation</Button>
    </div>
  );
};

export default VacationCard;
