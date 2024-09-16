import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import VacationCard from './VacationCard';
import { VacationModel } from '../../model/VacationModel';
import { Row, Col, Form } from 'react-bootstrap';
import { addVacation } from '../../store/slices/vacationslice';
import InfiniteScroll from 'react-infinite-scroller';
import { fetchPaginatedVacations } from '../../api/vactions/vacationsThunk';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const VacationList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { vacations, status, error } = useSelector((state: RootState) => state.vacation);
    const { user } = useSelector((state: RootState) => state.auth);
    const [filter, setFilter] = useState<string>('all');
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [newVacation, setNewVacation] = useState<VacationModel | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const isAdmin = user?.isAdmin;

    useEffect(() => {
        dispatch(fetchPaginatedVacations({ page, limit: 10 }));
    }, [dispatch, page]);

    const loadMoreVacations = async () => {
        if (hasMore && !loading) {
            setLoading(true);
            try {
                const actionResult = await dispatch(fetchPaginatedVacations({ page: page + 1, limit: 10 }));
                const newVacations = actionResult.payload as VacationModel[];

                if (newVacations.length === 0) {
                    setHasMore(false);
                } else {
                    setPage(prevPage => prevPage + 1);
                }
            } catch (error) {
                console.error('Failed to load more vacations:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAddVacation = async () => {
        if (newVacation) {
            await dispatch(addVacation(newVacation));
            dispatch(fetchPaginatedVacations({ page: 1, limit: 10 }));
        }
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        dispatch(fetchPaginatedVacations({ page: value, limit: 10 }));
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
                return isFollowing;
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
            {!isAdmin && (
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
            <InfiniteScroll
                pageStart={0}
                loadMore={loadMoreVacations}
                hasMore={hasMore}
                loader={<div key={0}>Loading...</div>}
            >
                <Row>
                    {sortedVacations.map((vacation: VacationModel) => (
                        <Col key={vacation.id || "placeholder"} md={4} className="mb-4">
                            <VacationCard vacation={vacation} />
                        </Col>
                    ))}
                </Row>
            </InfiniteScroll>
            <Stack spacing={2} className="mt-4">
                <Pagination
                    count={10} // Update this with the actual total page count from your API
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Stack>
        </div>
    );
};

export default VacationList;
