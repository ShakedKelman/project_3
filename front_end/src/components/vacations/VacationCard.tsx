import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFollowersForVacation } from '../../api/followers/follower-api';
import { getImagesForVacation } from '../../api/images/images-api';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { VacationModel } from '../../model/VacationModel';
import { siteConfig } from '../../utils/SiteConfig';

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
};

interface VacationCardProps {
  vacation: VacationModel;
}

const VacationCard: React.FC<VacationCardProps> = ({ vacation }) => {
    const [followers, setFollowers] = useState<any[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdditionalData = async () => {
            try {
                if (vacation.id) {
                    const vacationFollowers = await getFollowersForVacation(vacation.id);
                    setFollowers(vacationFollowers);

                    const vacationImages = await getImagesForVacation(vacation.id);
                    console.log("Fetched images:", vacationImages); // Debugging line
                    setImages(vacationImages);
                }
            } catch (error) {
                console.error("Error fetching additional data:", error);
            }
        };
        fetchAdditionalData();
    }, [vacation.id]);

    const getImageUrl = (imagePath: string) => {
        const url = `${siteConfig.BASE_URL}${imagePath}`;
        console.log('Image URL:', url); // Debugging line
        return url;
    };

    const handleAddVacation = () => {
        navigate('/add-vacation');
    };

    return (
        <div>
            <h1>Vacations</h1>
            <Row>
                <Col key={vacation.id} md={4}>
                    <Card>
                        <Card.Img
                            variant="top"
                            src={images.length > 0 ? getImageUrl(images[0]) : 'placeholder.jpg'}
                            alt={vacation.destination}
                        />

                        <Card.Body>
                            <Card.Title>{vacation.destination}</Card.Title>
                            <Card.Text>
                                {vacation.description}<br />
                                {`Start Date: ${formatDate(vacation.startDate)}`}<br />
                                {`End Date: ${formatDate(vacation.endDate)}`}<br />
                                {`Price: $${vacation.price}`}<br />
                                {`Followers: ${followers.length}`}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Button onClick={handleAddVacation}>Add Vacation</Button>
        </div>
    );
};

export default VacationCard;
