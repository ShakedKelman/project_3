import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFollowersForVacation, addFollower, removeFollower } from '../../api/followers/follower-api'; // Ensure import
import { getImagesForVacation } from '../../api/images/images-api';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { VacationModel } from '../../model/VacationModel';
import { siteConfig } from '../../utils/SiteConfig';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { selectUser } from '../../store/slices/authSlice';
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
    const user = useAppSelector(selectUser);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAdditionalData = async () => {
            try {
                if (vacation.id) {
                    // Fetch followers
                    const vacationFollowers = await getFollowersForVacation(vacation.id);
                    setFollowers(vacationFollowers);

                    if (user && user.id !== undefined) {
                        const followerIds = vacationFollowers.map(follower => follower.id);
                        setIsFollowing(followerIds.includes(user.id));
                    } else {
                        setIsFollowing(false);
                    }

                    // Fetch images
                    const vacationImages = await getImagesForVacation(vacation.id);
                    setImages(vacationImages);
                }
            } catch (error) {
                console.error('Error fetching additional data:', error);
            }
        };
        fetchAdditionalData();
    }, [vacation.id, user]);

    const getImageUrl = (imagePath: string) => {
        return `${siteConfig.BASE_URL}${imagePath}`;
    };

    const handleAddVacation = () => {
        navigate('/add-vacation');
    };

    const handleFollowClick = async () => {
        if (!user || !user.id || !vacation.id) {
            setError('User or Vacation ID is missing');
            return;
        }

        try {
            if (isFollowing) {
                // Remove follower
                if (user.token) {
                    await removeFollower(user.id, vacation.id, user.token);
                    setFollowers(prev => prev.filter(follower => follower.id !== user.id));
                    setIsFollowing(false);
                } else {
                    setError('Authentication token is missing.');
                }
            } else {
                // Add follower
                if (user.token) {
                    await addFollower(user.id, vacation.id, user.token);
                    setFollowers(prev => [...prev, { id: user.id }]);
                    setIsFollowing(true);
                } else {
                    setError('Authentication token is missing.');
                }
            }
            setError(null);
        } catch (error) {
            setError('Failed to update follower status. Please try again later.');
            console.error('Error updating follower:', error);
        }
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
                            <div>
                                <p>{vacation.description}</p>
                                <p>{`Start Date: ${formatDate(vacation.startDate)}`}</p>
                                <p>{`End Date: ${formatDate(vacation.endDate)}`}</p>
                                <p>{`Price: $${vacation.price}`}</p>
                                <div className="d-flex align-items-center">
                                    {isFollowing ? (
                                        <FavoriteIcon
                                            style={{
                                                marginRight: '5px',
                                                cursor: 'pointer',
                                                color: 'red'
                                            }}
                                            onClick={handleFollowClick}
                                        />
                                    ) : (
                                        <FavoriteBorderIcon
                                            style={{
                                                marginRight: '5px',
                                                cursor: 'pointer',
                                                color: 'gray'
                                            }}
                                            onClick={handleFollowClick}
                                        />
                                    )}
                                    <span>{followers.length}</span>
                                    {user && isFollowing && (
                                        <span style={{ marginLeft: '10px', color: 'green' }}>
                                            You follow this vacation
                                        </span>
                                    )}
                                </div>
                                {error && <div style={{ color: 'red' }}>{error}</div>}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Button onClick={handleAddVacation}>Add Vacation</Button>
        </div>
    );
};

export default VacationCard;
