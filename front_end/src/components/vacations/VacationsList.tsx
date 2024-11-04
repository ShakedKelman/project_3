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
import { setAllVacations, updateMultipleVacations, setLoadingStatus, setSuccessStatus, setPaginatedVacations, setErrorStatus, setInitialized } from '../../store/slices/vacationslice';
import "../../css/vactionList.css";
import { fetchFollowersForVacations } from '../../api/followers/followersThunk';


const VacationList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, token } = useSelector((state: RootState) => state.auth);
    const { 
        vacations, 
        paginatedVacations, 
        status: vacationStatus,
        initialized 
    } = useSelector((state: RootState) => state.vacation);
    // const { vacations, error } = useSelector((state: RootState) => state.vacation);
    // const { user, token, status } = useSelector((state: RootState) => state.auth);
    // const followedVacations = useSelector(selectVacations);

    const [filter, setFilter] = useState<string>('all');
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    // const [loading, setLoading] = useState<boolean>(false);
    // const [allVacations, setAllVacations] = useState<VacationModel[]>([]);
    // const deletedVacations: any[] = [];
    // const { token: reduxToken, status, count } = useSelector((state: RootState) => state.auth);

    const isAdmin = user?.isAdmin;

    // // Handling token and state logic
    // if (status === 'succeeded' && count === 0) {
    //     // Token from Redux state is valid, use it
    //     console.log("Token from Redux:", reduxToken);

    //     // Update token in localStorage if necessary
    //     if (reduxToken && reduxToken !== token) {
    //         localStorage.setItem('token', reduxToken);
    //         setToken(reduxToken); // Update the token reference
    //     }
    // } else {
    //     console.log("either reducer already worked or the count is greater than zero", status, count);
    // }

    // useEffect(() => {
    //     const currentToken = reduxToken || localStorage.getItem('token') || undefined;
    //     if (currentToken !== undefined) setToken(currentToken)
    // }, [dispatch]);



    useEffect(() => {
        // //dispatch(fetchApiCalls());
        // if (token === '') return

        // if (loading) return; // Prevent fetching if loading is true
        if (!token || initialized) return; // Skip if already initialized
        const initializeData = async () => {
            dispatch(setLoadingStatus());
            try {
                // Fetch all vacations only once
                const allVacations = await getVacations(undefined, token);
                dispatch(setAllVacations(allVacations));

                // Get all vacation IDs and fetch followers in one batch
                const vacationIds = allVacations.map(v => v.id!).filter(id => id !== undefined);
                const followersData = await dispatch(fetchFollowersForVacations({ 
                    vacationIds, 
                    token 
                })).unwrap();

                // Update vacations with follower info
                const updatedVacations = allVacations.map(vacation => {
                    const followerInfo = followersData.find(f => f.vacationId === vacation.id);
                    return {
                        ...vacation,
                        followerCount: followerInfo?.followers.length || 0,
                        isFollowing: user?.id ? followerInfo?.followers.some(f => f.id === user.id) || false : false
                    };
                });

                dispatch(updateMultipleVacations(updatedVacations));
                dispatch(setInitialized()); // Mark as initialized
                dispatch(setSuccessStatus());
            } catch (error) {
                console.error('Error initializing data:', error);
                dispatch(setErrorStatus('An unknown error occurred'));
            }
        };

        initializeData();
    }, [dispatch, token, initialized, user?.id]);
    //     const fetchData = async () => {
    //         dispatch(setLoadingStatus());
    //         try {

    //         // Fetch all vacations
    //         const allVacations = await getVacations(undefined, token);
    //         dispatch(setAllVacations(allVacations));

    //             // Update pagination count
    //             // const totalVacations = vacations.length;
    //             // const calculatedTotalPages = Math.ceil(totalVacations / 10);
    //             // setTotalPages(calculatedTotalPages);
    //              // Update pagination count based on filtered results if not admin
    //             //  const filteredVacations = isAdmin ? allVacations : applyFilter(allVacations, filter);
    //             //  const totalVacations = filteredVacations.length;
    //             //  setTotalPages(Math.ceil(totalVacations / 10));

    //         // Get all vacation IDs and fetch followers for all vacations at once
    //         const vacationIds = allVacations.map(v => v.id!).filter(id => id !== undefined);
    //         const followersData = await dispatch(fetchFollowersForVacations({ 
    //             vacationIds, 
    //             token 
    //         })).unwrap();

    //         // Update vacations with follower info
    //         const updatedVacations = allVacations.map(vacation => {
    //             const followerInfo = followersData.find(f => f.vacationId === vacation.id);
    //             return {
    //                 ...vacation,
    //                 followerCount: followerInfo?.followers.length || 0,
    //                 isFollowing: user?.id ? followerInfo?.followers.some(f => f.id === user.id) || false : false
    //             };
    //         });

    //         dispatch(updateMultipleVacations(updatedVacations));
    //                                 // Fetch initial paginated data
    //             dispatch(fetchPaginatedVacations({ 
    //                 page: 1, 
    //                 limit: 10, 
    //                 token 
    //             }));

    //             dispatch(setSuccessStatus());
    //         } catch (error) {
    //             console.error('Error fetching vacations:', error);
    //         }
    //     };

    //     fetchData();
    // }, [dispatch, token, user?.id]);

    //             // Batch update follower info through Redux
    //             dispatch(updateVacationsWithFollowers(
    //                 followerUpdates.filter((update): update is NonNullable<typeof update> => update !== null)
    //             ));

    //             // Fetch paginated vacations for the first page
    //             dispatch(fetchPaginatedVacations({ page: 1, limit: 10, token }));

    //             // Fetch user's followed vacations if not admin
    //             if (!isAdmin && user?.id && followedVacations.length === 0) {
    //                 dispatch(fetchVacationsPerUser({ userId: user.id, token }));
    //             }

    //         } catch (error) {
    //             console.error('Error fetching vacations:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, [dispatch, token, user?.id, filter, isAdmin]); 


    // useEffect(() => {
    //     // When filter changes, reset to the first page
    //     setPage(1);
    // }, [filter]);

     // Update total pages and handle pagination when filter or vacations change
     useEffect(() => {
        const filteredVacations = isAdmin ? vacations : applyFilter(vacations, filter);
        const total = Math.ceil(filteredVacations.length / 10);
        setTotalPages(total);
        
        // If current page is beyond new total, reset to page 1
        if (page > total) {
            setPage(1);
        }

     // Create a new array before sorting and slicing
     const paginatedData = [...filteredVacations]
     .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
     .slice((page - 1) * 10, page * 10);
 
 dispatch(setPaginatedVacations(paginatedData));
}, [filter, vacations, isAdmin, page]);



    // const applyFilter = (vacations: VacationModel[], filter: string) => {
    //     const now = new Date();
    //     return vacations.filter((vacation: VacationModel) => {
    //         const startDate = new Date(vacation.startDate);
    //         const endDate = new Date(vacation.endDate);

    //         switch (filter) {
    //             case 'following':
    //                 return vacation.isFollowing;
    //             case 'notStarted':
    //                 return startDate > now;
    //             case 'happeningNow':
    //                 return startDate <= now && endDate >= now;
    //             default:
    //                 return true;
    //         }
    //     });
    // };
    const applyFilter = (vacations: VacationModel[], filter: string) => {
        const now = new Date();
        return vacations.filter((vacation: VacationModel) => {
            const startDate = new Date(vacation.startDate);
            const endDate = new Date(vacation.endDate);
    
            // Return all vacations if filter is 'all'
            if (filter === 'all') return true;
    
            // For other filters, check the specific conditions
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
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    // const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    //     setPage(value);
    // };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
        setPage(1); // Reset to first page when filter changes
    };

    if (vacationStatus === 'loading') return <div>Loading...</div>;

    // if (status === 'loading' || loading) return <div>Loading...</div>;
    // // Get displayed vacations based on filters and pagination
    // const filteredVacations = isAdmin ? paginatedVacations : applyFilter(paginatedVacations, filter);
    // const sortedVacations = [...filteredVacations].sort((a, b) => {
    //     return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    // });

    // let filteredVacations = allVacations;
    // if (!isAdmin) {
    //     // Filter vacations
    //     filteredVacations = applyFilter(allVacations, filter);
    // }

    // // sort vacations
    // const sortedVacations = [...filteredVacations].sort((a, b) => {
    //     const dateA = new Date(a.startDate);
    //     const dateB = new Date(b.startDate);
    //     return dateA.getTime() - dateB.getTime();
    // });

    // // Apply pagination to sorted vacations
    // const startIndex = (page - 1) * 10;
    // const paginatedVacations = sortedVacations.slice(startIndex, startIndex + 10);

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
