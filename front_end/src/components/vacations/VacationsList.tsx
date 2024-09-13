import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchVacations } from '../../api/vactions/vacationsThunk';
import VacationCard from './VacationCard';
import { VacationModel } from '../../model/VacationModel';
import { Row, Col, Form } from 'react-bootstrap'; // Import Form for checkboxes

const VacationList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { vacations, status, error } = useSelector((state: RootState) => state.vacation);
    const [filter, setFilter] = useState({
        following: false,
        notStarted: false,
        happeningNow: false
    });

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchVacations());
        }
    }, [dispatch, status]);

    if (status === 'loading') return <div>Loading...</div>;
    if (status === 'failed') return <div>{error}</div>;

    // Filter vacations based on filter state
    const filteredVacations = vacations.filter((vacation: VacationModel) => {
        const now = new Date();
        const startDate = new Date(vacation.startDate);
        const endDate = new Date(vacation.endDate);
        const isFollowing = true; // Replace with actual following check logic

        let shouldInclude = true;

        if (filter.following) {
            shouldInclude = shouldInclude && isFollowing; // Adjust with actual logic
        }
        if (filter.notStarted) {
            shouldInclude = shouldInclude && startDate > now;
        }
        if (filter.happeningNow) {
            shouldInclude = shouldInclude && startDate <= now && endDate >= now;
        }

        return shouldInclude;
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFilter(prev => ({ ...prev, [name]: checked }));
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
                    type="checkbox" 
                    label="Following" 
                    name="following"
                    checked={filter.following}
                    onChange={handleFilterChange}
                />
                <Form.Check 
                    type="checkbox" 
                    label="Not Started" 
                    name="notStarted"
                    checked={filter.notStarted}
                    onChange={handleFilterChange}
                />
                <Form.Check 
                    type="checkbox" 
                    label="Happening Now" 
                    name="happeningNow"
                    checked={filter.happeningNow}
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
