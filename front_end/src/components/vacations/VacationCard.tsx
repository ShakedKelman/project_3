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
import { addVacationFollower, removeVacationFollower } from '../../api/followers/followersThunk';
import { getFollowersForVacation } from '../../api/followers/follower-api';
import { getImageForVacation } from '../../api/images/images-api';
import { selectFollowers } from '../../store/slices/followersSlice';
import { AppDispatch, RootState } from '../../store/store';

const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
};


interface VacationCardProps {
    vacation: VacationModel;
    onChangeFn: Function;
   // token: string;
}

const VacationCard: React.FC<VacationCardProps> = ({ vacation, onChangeFn }) => {
    const { user, token } = useSelector((state: RootState) => state.auth);
    const [images, setImages] = useState<string[]>([]);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const navigate = useNavigate();
    // const user = useSelector(selectUser);
    const followers = useSelector(selectFollowers);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const [totalFollowers, setTotalFollowers] = useState<number>(0); // Added state for total followers
    //const { token: reduxToken, status, count } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const fetchAdditionalData = async () => {
            if (vacation.id === undefined || isNaN(vacation.id)) return;
            if (!token) return; // Add early return if no token

            //const token = getToken(reduxToken, count !== null ? count : -1); // Replace 0 with whatever default makes sense

            try {
                // Fetch vacation followers and images
                const vacationFollowers = await getFollowersForVacation(vacation.id,token);
                setTotalFollowers(vacationFollowers.length);

                const vacationImages = await getImageForVacation(vacation.id);
                setImages(vacationImages);
    
                // Check if the user is following
                if (user && user.id !== undefined) {
                    const followerIds = vacationFollowers.map(follower => follower.id);
                    setIsFollowing(followerIds.includes(user.id));
                } else {
                    setIsFollowing(false);
                }
            } catch (error) {
                console.error('Error fetching additional data:', error);
            }
        };
    
        fetchAdditionalData();
    }, [vacation.id, user]);
    
  
    const handleFollowClick = async () => {
     
        
        if (!user?.id || !vacation.id || !token) {
            setError('User or Vacation ID or token is missing');
            return;
        }
    
        try {
            if (isFollowing) {
                // Remove follower
                await dispatch(removeVacationFollower({ userId: user.id, vacationId: vacation.id, token }) as any);
                setIsFollowing(false);
            } else {
                // Add follower
                await dispatch(addVacationFollower({ userId: user.id, vacationId: vacation.id, token }) as any);
                setIsFollowing(true);
            }
    
            onChangeFn(user?.id, 'follow');

            // Re-fetch vacations to get the correct total followers
            const vacationFollowers = await getFollowersForVacation(vacation.id,token);
            setTotalFollowers(vacationFollowers.length); // Update total followers count

            // Update the following status based on the new list of followers
            const followerIds = vacationFollowers.map(follower => follower.id);
            setIsFollowing(followerIds.includes(user.id));
    
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
            
            if (!token) {
                setError('Authentication token is missing.');
                return;
            }

            try {
                await deleteVacation(vacation.id, token);
                dispatch(deleteVacationReducer(vacation.id));
                onChangeFn(vacation?.id, 'delete')
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
                                src={`${siteConfig.BASE_URL}images/${vacation.id}`}
                                alt={vacation.destination}
                            />
                            <Card.Title className="vacation-card-title">{vacation.destination}</Card.Title>
                        </div>
                        <Card.Body className="vacation-card-body">
                            <div className="vacation-card-text">
                                <p>{vacation.description}</p>
                                <p>{`Start Date: ${formatDate(vacation.startDate)}`}</p>
                                <p>{`End Date: ${formatDate(vacation.endDate)}`}</p>
                                <div className="vacation-card-price">{`Price: $${vacation.price}`}</div>

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
                                              <span>{totalFollowers}</span> {/* Display total followers */}
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
