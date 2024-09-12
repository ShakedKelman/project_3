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
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // Import the icon from Material UI
import { selectUser } from '../../store/slices/authSlice'; // Import the selector
import { useAppSelector } from '../../store/store';

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
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const navigate = useNavigate();
    const user = useAppSelector(selectUser); // Get logged-in user from Redux
    useEffect(() => {
        const fetchAdditionalData = async () => {
            try {
                if (vacation.id) {
                    // Fetch followers
                    const vacationFollowers = await getFollowersForVacation(vacation.id);
                    console.log('Fetched Followers:', vacationFollowers); // Debugging
        
                    // Set followers data
                    setFollowers(vacationFollowers);
    
                    // Ensure user is defined and has an id
                    if (user && user.id !== undefined) {
                        const followerIds = vacationFollowers.map(follower => follower.id);
                        console.log('Logged-in User:', user); // Debugging
                        const isUserFollowing = followerIds.includes(user.id);
                        console.log('Is User Following:', isUserFollowing); // Debugging
                        setIsFollowing(isUserFollowing);
                    } else {
                        console.warn('User or User ID is undefined');
                        setIsFollowing(false); // Handle the case where user or user.id is not defined
                    }
        
                    // Fetch images
                    const vacationImages = await getImagesForVacation(vacation.id);
                    console.log('Fetched images:', vacationImages); // Debugging
                    setImages(vacationImages);
                }
            } catch (error) {
                console.error('Error fetching additional data:', error);
            }
        };
        fetchAdditionalData();
    }, [vacation.id, user]);
    
    
        

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
                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Img
                            variant="top"
                            src={images.length > 0 ? getImageUrl(images[0]) : 'placeholder.jpg'}
                            alt={vacation.destination}
                            style={{ height: '100px', objectFit: 'cover', width: '100px' }}
                        />
                        <Card.Body>
                            <Card.Title>{vacation.destination}</Card.Title>
                            <Card.Text>
                                {vacation.description}<br />
                                {`Start Date: ${formatDate(vacation.startDate)}`}<br />
                                {`End Date: ${formatDate(vacation.endDate)}`}<br />
                                {`Price: $${vacation.price}`}<br />
                                <div className="d-flex align-items-center">
                                    <FavoriteBorderIcon style={{ marginRight: '5px' }} />
                                    {followers.length}
                                    {user && isFollowing && (
                                        <span style={{ marginLeft: '10px', color: 'green' }}>
                                            You follow this vacation
                                        </span>
                                    )}
                                </div>
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
