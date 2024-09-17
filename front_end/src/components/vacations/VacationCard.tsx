import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import { VacationModel } from '../../model/VacationModel';
import { siteConfig } from '../../utils/SiteConfig';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { selectUser } from '../../store/slices/authSlice';
import { deleteVacation } from '../../api/vactions/vactions-api';
import { deleteVacationReducer } from '../../store/slices/vacationslice';
import '../../css/vacationCard.css';
import { addVacationFollower, fetchFollowers, removeVacationFollower } from '../../api/followers/followersThunk';
import { getFollowersForVacation } from '../../api/followers/follower-api';
import { getImagesForVacation } from '../../api/images/images-api';
import { selectFollowers } from '../../store/slices/followersSlice';
import { AppDispatch } from '../../store/store';

const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
};

    const getToken = (): string | null => {
        return localStorage.getItem('token');
    };


interface VacationCardProps {
    vacation: VacationModel;
}

const VacationCard: React.FC<VacationCardProps> = ({ vacation }) => {
    const [images, setImages] = useState<string[]>([]);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const followers = useSelector(selectFollowers);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    
    useEffect(() => {
        console.log('User:', user); // Add this to debug user state
        const fetchAdditionalData = async () => {
            try {
                if (vacation.id) {
                    const vacationFollowers = await getFollowersForVacation(vacation.id);
                    const vacationImages = await getImagesForVacation(vacation.id);
                    setImages(vacationImages);
            
                    dispatch(fetchFollowers(vacation.id));
            
                    if (user && user.id !== undefined) {
                        const followerIds = vacationFollowers.map(follower => follower.id);
                        setIsFollowing(followerIds.includes(user.id));
                    } else {
                        setIsFollowing(false);
                    }
                }
            } catch (error) {
                console.error('Error fetching additional data:', error);
            }
        };
        
        fetchAdditionalData();
    }, [vacation.id, user, dispatch]);
    
    const getImageUrl = (imagePath: string) => {
        return `${siteConfig.BASE_URL}${imagePath}`;
    };
    
    const handleFollowClick = async () => {
        const token = getToken(); // Retrieve the token
        
        console.log('User:', user); // Debug user state
        console.log('Vacation ID:', vacation.id); // Debug vacation ID
        console.log('User Token:', token); // Safely access token

        if (!user?.id || !vacation.id || !token) {
            setError('User or Vacation ID or token is missing');
            return;
        }
    
        try {
            if (isFollowing) {
                await dispatch(removeVacationFollower({ userId: user.id, vacationId: vacation.id, token }) as any);
                setIsFollowing(false);
            } else {
                await dispatch(addVacationFollower({ userId: user.id, vacationId: vacation.id, token }) as any);
                setIsFollowing(true);
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
            const token = getToken(); // Retrieve the token
            
            if (!token) {
                setError('Authentication token is missing.');
                return;
            }

            try {
                await deleteVacation(vacation.id, token);
                dispatch(deleteVacationReducer(vacation.id));
            } catch (error) {
                setError('Failed to delete vacation. Please try again later.');
                console.error('Error deleting vacation:', error);
            }
        }
    };

    return (
        <div>
            <Row>
                <Col md={8} className="mb-4">
                    <Card className="vacation-card">
                        <div className="vacation-card-img-container">
                            <Card.Img
                                className="vacation-card-img"
                                variant="top"
                                src={images.length > 0 ? getImageUrl(images[0]) : 'placeholder.jpg'}
                                alt={vacation.destination}
                            />
                            <Card.Title className="vacation-card-title">{vacation.destination}</Card.Title>
                        </div>
                        <Card.Body className="vacation-card-body">
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
                                                    style={{ marginRight: '5px', cursor: 'pointer', color: 'red' }}
                                                    onClick={handleFollowClick}
                                                />
                                            ) : (
                                                <FavoriteBorderIcon
                                                    style={{ marginRight: '5px', cursor: 'pointer', color: 'gray' }}
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
                                        <DeleteIcon
                                            style={{ marginRight: '10px', cursor: 'pointer', color: 'red' }}
                                            onClick={handleDeleteVacation}
                                        />
                                        <EditIcon
                                            style={{ cursor: 'pointer', color: 'orange' }}
                                            onClick={handleEditVacation}
                                        />
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
