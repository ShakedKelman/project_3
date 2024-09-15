import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFollowersForVacation, addFollower, removeFollower } from '../../api/followers/follower-api';
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
import { useAppDispatch, useAppSelector } from '../../store/store';
import { deleteVacation } from '../../api/vactions/vactions-api';
import { deleteVacationReducer } from '../../store/slices/vacationslice';
import '../../css/vacationCard.css';

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
    const dispatch = useAppDispatch(); // Hook for dispatching actions

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
                    console.log(vacationImages);
                    
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

    const handleEditVacation = () => {
        navigate(`/edit-vacation/${vacation.id}`);
    };

    const handleDeleteVacation = async () => {
        if (!vacation.id) {
            setError('Vacation ID is missing.');
            return;
        }

        if (window.confirm('Are you sure you want to delete this vacation?')) {
            if (!user?.token) {
                setError('Authentication token is missing.');
                return;
            }

            try {
                // Call deleteVacation with the vacation ID and user token
                await deleteVacation(vacation.id, user.token);
                console.log('Deleting vacation with ID:', vacation.id);
                dispatch(deleteVacationReducer(vacation.id));

                // Optionally, you can navigate away or refresh the list after deletion
                // navigate('/some-route'); // Navigate or refresh as needed
            } catch (error) {
                setError('Failed to delete vacation. Please try again later.');
                console.error('Error deleting vacation:', error);
            }
        }
    };

    return (
        <div>
            <Row>
                <Col md={6} className="mb-4">
                    <Card className="vacation-card">
                        <Card.Img
                            className="vacation-card-img"
                            variant="top"
                            src={images.length > 0 ? getImageUrl(images[0]) : 'placeholder.jpg'}
                            alt={vacation.destination}
                        />
                        <Card.Body className="vacation-card-body">
                            <Card.Title className="vacation-card-title">{vacation.destination}</Card.Title>
                            <div className="vacation-card-text">
                                <p>{vacation.description}</p>
                                <p>{`Start Date: ${formatDate(vacation.startDate)}`}</p>
                                <p>{`End Date: ${formatDate(vacation.endDate)}`}</p>
                                <p>{`Price: $${vacation.price}`}</p>
                                {!user?.isAdmin ? (
                                    <div className="vacation-card-actions">
                                        <div className="vacation-card-favorites">
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
                                                <span className="following" style={{ marginLeft: '10px' }}>
                                                    You follow this vacation
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="vacation-card-buttons">
                                        <Button variant="danger" onClick={handleDeleteVacation}>
                                            Delete
                                        </Button>
                                        <Button variant="warning" onClick={handleEditVacation}>
                                            Edit
                                        </Button>
                                    </div>
                                )}
                                {error && <div style={{ color: 'red' }}>{error}</div>}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default VacationCard;
