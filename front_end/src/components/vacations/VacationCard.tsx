import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVacations } from '../../api/vactions/vactions-api';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getFollowersForVacation } from '../../api/followers/follower-api';

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
};

const VacationCard: React.FC = () => {
  const [vacations, setVacations] = useState<any[]>([]);
  const [followers, setFollowers] = useState<{ [key: number]: any[] }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVacations = async () => {
      try {
        const fetchedVacations = await getVacations();
        setVacations(fetchedVacations);

        // Fetch followers for each vacation if the id is defined
        const followersData: { [key: number]: any[] } = {};
        for (const vacation of fetchedVacations) {
          if (vacation.id !== undefined) {
            const vacationFollowers = await getFollowersForVacation(vacation.id);
            followersData[vacation.id] = vacationFollowers;
          }
        }
        setFollowers(followersData);
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
                  {`Price: $${vacation.price}`}<br />
                  {`Followers: ${followers[vacation.id]?.length || 0}`}
                
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
