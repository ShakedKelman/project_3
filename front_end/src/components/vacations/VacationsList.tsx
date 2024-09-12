import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchVacations } from '../../api/vactions/vacationsThunk';
import VacationCard from './VacationCard';
import { VacationModel } from '../../model/VacationModel';
import { Row, Col } from 'react-bootstrap'; // Import Row and Col from React Bootstrap

const VacationList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { vacations, status, error } = useSelector((state: RootState) => state.vacation);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchVacations());
        }
    }, [dispatch, status]);

    if (status === 'loading') return <div>Loading...</div>;
    if (status === 'failed') return <div>{error}</div>;

    return (
        <div className="container">
            <Row>
                {vacations.map((vacation: VacationModel) => (
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
