import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import VacationCard from './VacationCard';
import { VacationModel } from '../../model/VacationModel';
import { Row, Col, Form } from 'react-bootstrap';
import { fetchPaginatedVacations } from '../../api/vactions/vacationsThunk';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { getVacations } from '../../api/vactions/vactions-api';
import { getFollowersForVacation } from '../../api/followers/follower-api';
import { setAllVacations, updateMultipleVacations, setLoadingStatus, setSuccessStatus, setPaginatedVacations, setInitialized, setErrorStatus, setCurrentPage } from '../../store/slices/vacationslice';
import "../../css/vactionList.css";
import { getImageForVacation } from '../../api/images/images-api';


const VacationList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, token } = useSelector((state: RootState) => state.auth);

    const [filter, setFilter] = useState<string>('all');
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);

    const { 
        vacations, 
        paginatedVacations, 
        status: vacationStatus,
        currentPage,
        itemsPerPage,
        isInitialized
    } = useSelector((state: RootState) => state.vacation);

    const isAdmin = user?.isAdmin;

    useEffect(() => {
        const fetchData = async () => {
            if (!token || isInitialized || vacationStatus === 'loading') return;

            dispatch(setLoadingStatus());
            try {
                const allVacations = await getVacations(undefined, token);
                const vacationIds = Array.from(new Set(allVacations.map(v => v.id)))
                    .filter((id): id is number => id !== undefined);
                
                const batchSize = 5;
                const followerResults: { id: number }[][] = [];
                
                for (let i = 0; i < vacationIds.length; i += batchSize) {
                    const batch = vacationIds.slice(i, i + batchSize);
                    const batchPromises = batch.map(id => 
                        getFollowersForVacation(id, token)
                            .catch(error => {
                                console.error(`Error fetching followers for vacation ${id}:`, error);
                                return [];
                            })
                    );
                    const batchResults = await Promise.all(batchPromises);
                    followerResults.push(...batchResults);
                    
                    if (i + batchSize < vacationIds.length) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }

                const updatedVacations = allVacations.map((vacation, index) => ({
                    ...vacation,
                    followerCount: followerResults[index]?.length || 0,
                    isFollowing: user?.id ? followerResults[index]?.some(f => f.id === user.id) : false
                }));

                dispatch(setAllVacations(updatedVacations));
                dispatch(setPaginatedVacations(updatedVacations.slice(0, itemsPerPage)));
                dispatch(setSuccessStatus());
                dispatch(setInitialized());
            } catch (error) {
                console.error('Error fetching vacations:', error);
                dispatch(setErrorStatus('Failed to fetch vacations'));
            }
        };

        fetchData();
    }, [token, dispatch, user?.id, isInitialized, itemsPerPage, vacationStatus]);

    useEffect(() => {
        const filteredVacations = isAdmin ? vacations : applyFilter(vacations, filter);
        const total = Math.ceil(filteredVacations.length / itemsPerPage);
        setTotalPages(total);

        if (currentPage > total && total > 0) {
            dispatch(setCurrentPage(1));
        }

        const sortedVacations = [...filteredVacations].sort((a, b) => 
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        dispatch(setPaginatedVacations(sortedVacations.slice(startIndex, endIndex)));
    }, [filter, vacations, isAdmin, currentPage, itemsPerPage]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        dispatch(setCurrentPage(value));
    };

    const applyFilter = (vacations: VacationModel[], filter: string) => {
        const now = new Date();
        return vacations.filter((vacation: VacationModel) => {
            const startDate = new Date(vacation.startDate);
            const endDate = new Date(vacation.endDate);

            if (filter === 'all') return true;

            switch (filter) {
                case 'following':
                    return vacation.isFollowing === true;
                case 'notStarted':
                    return startDate > now;
                case 'happeningNow':
                    return startDate <= now && endDate >= now;
                default:
                    return true;
            }
        });
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
        setPage(1);
    };

    if (vacationStatus === 'loading') return <div>Loading...</div>;

    return (
        <div className="container">
            {!isAdmin && (
                <Form>
                    <Form.Check
                        type="radio"
                        label="All"
                        name="filter"
                        value="all"
                        checked={filter === 'all'}
                        onChange={handleFilterChange}
                        className="custom-radio"
                    />
                    <Form.Check
                        type="radio"
                        label="Following"
                        name="filter"
                        value="following"
                        checked={filter === 'following'}
                        onChange={handleFilterChange}
                        className="custom-radio"
                    />
                    <Form.Check
                        type="radio"
                        label="Not Started"
                        name="filter"
                        value="notStarted"
                        checked={filter === 'notStarted'}
                        onChange={handleFilterChange}
                        className="custom-radio"
                    />
                    <Form.Check
                        type="radio"
                        label="Happening Now"
                        name="filter"
                        value="happeningNow"
                        checked={filter === 'happeningNow'}
                        onChange={handleFilterChange}
                        className="custom-radio"
                    />
                </Form>
            )}

            <Row>
                {paginatedVacations.map((vacation: VacationModel) => (
                    <Col key={vacation.id || "placeholder"} md={4} className="mb-4">
                        <VacationCard vacation={vacation} />
                    </Col>
                ))}
            </Row>

            <Stack spacing={2} className="mt-4">
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                />
            </Stack>
        </div>
    );
};

export default VacationList;
