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
import { selectVacations } from '../../store/slices/followersSlice';
import { getVacationsPerUser } from '../../api/followers/follower-api';
import { fetchVacationsPerUser } from '../../api/followers/followersThunk';
import { deleteVacationReducer } from '../../store/slices/vacationslice';


let token = localStorage.getItem('token') || null;

const VacationList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { vacations, error } = useSelector((state: RootState) => state.vacation);
    const { user } = useSelector((state: RootState) => state.auth);
    const [filter, setFilter] = useState<string>('all');
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [allVacations, setAllVacations] = useState<VacationModel[]>([]);
    const followedVacations = useSelector(selectVacations);
    const deletedVacations: any[] = [];
    const { token: reduxToken, status, count } = useSelector((state: RootState) => state.auth);

    const isAdmin = user?.isAdmin;
    // Example using Redux (adjust based on your state management)

    // Handling token and state logic
    if (status === 'succeeded' && count === -1) {
        // Token from Redux state is valid, use it
        console.log("Token from Redux:", reduxToken);

        // Update token in localStorage if necessary
        if (reduxToken && reduxToken !== token) {
            localStorage.setItem('token', reduxToken);
            token = reduxToken; // Update the token reference
        }
    } else {
        console.error("Unable to fetch the token or invalid state");
    }

    useEffect(() => {
        if (loading) return; // Prevent fetching if loading is true

        const fetchData = async () => {
            setLoading(true);
            try {
                // const currentToken = status === 'succeeded' && count === -1 ? reduxToken : token;
                const currentToken = reduxToken || localStorage.getItem('token') || undefined;

                // Fetch all vacations
                const vacations = await getVacations(undefined, currentToken);
                console.log('Current token:', currentToken); // Check what token is being used

                setAllVacations(vacations);

                // Update pagination count
                const totalVacations = vacations.length;
                const calculatedTotalPages = Math.ceil(totalVacations / 10);
                setTotalPages(calculatedTotalPages);

                // Fetch paginated vacations for the first page
                dispatch(fetchPaginatedVacations({ page: 1, limit: 10 }));

                // Check if user.id is defined before dispatching
                if (user?.id !== undefined && followedVacations.length === 0) {
                    dispatch(fetchVacationsPerUser(user.id));
                }

            } catch (error) {
                console.error('Error fetching vacations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch]);

    useEffect(() => {
        // When filter changes, reset to the first page
        setPage(1);
    }, [filter]);

    useEffect(() => {
        const fetchFilteredData = async () => {
            setLoading(true);
            try {
                const filteredVacations = applyFilter(allVacations, filter);
                const totalVacations = filteredVacations.length;
                const calculatedTotalPages = Math.ceil(totalVacations / 10);
                setTotalPages(calculatedTotalPages);

                // Fetch paginated filtered vacations
                dispatch(fetchPaginatedVacations({ page, limit: 10 }));
            } catch (error) {
                console.error('Error fetching filtered vacations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredData();
    }, [filter, page]);

    const callback = (vacationId: number, whatChanged: string) => {
        switch (whatChanged) {
            case 'follow':
                if (user?.id !== undefined) dispatch(fetchVacationsPerUser(user.id));
                break;
            case 'delete':
                dispatch(deleteVacationReducer(vacationId));
                // Remove vacation from the state
                setAllVacations(prevVacations => prevVacations.filter(vac => vac.id !== vacationId));
                break;
        }
    };

    const applyFilter = (vacations: VacationModel[], filter: string) => {
        const now = new Date();
        return vacations.filter((vacation: VacationModel) => {
            const startDate = new Date(vacation.startDate);
            const endDate = new Date(vacation.endDate);
            let isFollowing = false; // Replace with actual following check logic

            if (followedVacations.map(vac => vac.id).includes(vacation.id)) isFollowing = true;

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
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
    };

    if (status === 'loading' || loading) return <div>Loading...</div>;
    if (status === 'failed') return <div>{error}</div>;

    let filteredVacations = allVacations;
    if (!isAdmin) {
        // Filter vacations
        filteredVacations = applyFilter(allVacations, filter);
    }

    // sort vacations
    const sortedVacations = [...filteredVacations].sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateA.getTime() - dateB.getTime();
    });

    // Apply pagination to sorted vacations
    const startIndex = (page - 1) * 10;
    const paginatedVacations = sortedVacations.slice(startIndex, startIndex + 10);

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
            {/* <Row>
                {paginatedVacations.filter( v => !deletedVacations.includes(v.id)).map((vacation: VacationModel) => (
                    <Col key={vacation.id || "placeholder"} md={4} className="mb-4">
                        <VacationCard vacation={vacation} onChangeFn={callback} />
                    </Col>
                ))}
                
            </Row> */}
            <Row>
                {paginatedVacations.map((vacation: VacationModel) => (
                    <Col key={vacation.id || "placeholder"} md={4} className="mb-4">
                        <VacationCard vacation={vacation} onChangeFn={callback} />
                    </Col>
                ))}
            </Row>

            <Stack spacing={2} className="mt-4">
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Stack>
        </div>
    );
};

export default VacationList;
