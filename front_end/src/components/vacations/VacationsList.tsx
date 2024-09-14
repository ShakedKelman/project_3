import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchVacations } from '../../api/vactions/vacationsThunk';
import VacationCard from './VacationCard';
import { VacationModel } from '../../model/VacationModel';
import { Row, Col, Form } from 'react-bootstrap'; // Import Form for radio buttons

const VacationList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { vacations, status, error } = useSelector((state: RootState) => state.vacation);
    const [filter, setFilter] = useState<string>('all'); // State to hold the selected filter

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchVacations());
        }
    }, [dispatch, status]);

    if (status === 'loading') return <div>Loading...</div>;
    if (status === 'failed') return <div>{error}</div>;

    // Filter vacations based on the selected filter
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
                return true; // Show all vacations when no filter is selected
        }
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
    };

    // Ensure filtered vacations have valid date fields and sort them
    const sortedVacations = [...filteredVacations].sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateA.getTime() - dateB.getTime();
    });

    return (
        <div className="container">
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
            <Row>
                {sortedVacations.map((vacation: VacationModel) => (
                    <Col key={vacation.id || "placeholder"} md={6} className="mb-4">
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
