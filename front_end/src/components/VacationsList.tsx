import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import VacationCard from './VacationCard';
import { fetchVacations } from '../api/vacationsThunk';

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
        <div>
            {vacations.map(vacation => (
                <VacationCard key={vacation.id}/>
            ))}
        </div>
    );
};

export default VacationList;
