import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import VacationCard from './VacationCard';
import { VacationModel } from '../../model/VacationModel';
import { Row, Col, Form } from 'react-bootstrap'; // Import Form for radio buttons
import { addVacation } from '../../store/slices/vacationslice';
import { fetchPaginatedVacations } from '../../api/vactions/vacationsThunk';

const VacationList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { vacations, status, error } = useSelector((state: RootState) => state.vacation);
    const { user } = useSelector((state: RootState) => state.auth); // Get user from auth state
    const [filter, setFilter] = useState<string>('all');
    const [newVacation, setNewVacation] = useState<VacationModel | null>(null); // Example state

    const isAdmin = user?.isAdmin; // Check if user is an admin

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPaginatedVacations());
        }
    }, [dispatch, status]);

    const handleAddVacation = async () => {
        if (newVacation) {
            await dispatch(addVacation(newVacation));
            dispatch(fetchPaginatedVacations());
        }
    };

    if (status === 'loading') return <div>Loading...</div>;
    if (status === 'failed') return <div>{error}</div>;

    const filteredVacations = vacations.filter((vacation: VacationModel) => {
        const now = new Date();
        const startDate = new Date(vacation.startDate);
        const endDate = new Date(vacation.endDate);
        const isFollowing = true; // Replace with actual following check logic

        switch (filter) {
            case 'following':
                return isFollowing; // Adjust with actual logic
            case 'notStarted':
                return startDate > now;
            case 'happeningNow':
                return startDate <= now && endDate >= now;
            default:
                return true;
        }
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
    };

    const sortedVacations = [...filteredVacations].sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateA.getTime() - dateB.getTime();
    });

    return (
        <div className="container">
            {!isAdmin && ( // Render filters only for non-admin users
                <Form>
                    <Form.Check 
                        type="radio" 
                        label="All" 
                        name="filter"
                        value="all"
                        checked={filter === 'all'}
                        onChange={handleFilterChange}
                    />
                    <Form.Check 
                        type="radio" 
                        label="Following" 
                        name="filter"
                        value="following"
                        checked={filter === 'following'}
                        onChange={handleFilterChange}
                    />
                    <Form.Check 
                        type="radio" 
                        label="Not Started" 
                        name="filter"
                        value="notStarted"
                        checked={filter === 'notStarted'}
                        onChange={handleFilterChange}
                    />
                    <Form.Check 
                        type="radio" 
                        label="Happening Now" 
                        name="filter"
                        value="happeningNow"
                        checked={filter === 'happeningNow'}
                        onChange={handleFilterChange}
                    />
                </Form>
            )}
            <Row>
                {sortedVacations.map((vacation: VacationModel) => (
                    <Col key={vacation.id || "placeholder"} md={4} className="mb-4">
                        {vacation.id ? (
                            <VacationCard vacation={vacation} />
                        ) : (
                            <div>No ID for vacation</div>
                        )}
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default VacationList;
